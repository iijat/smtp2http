import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";
import { logger } from "./logger";
import { EnvService, EnvVariable } from "./services/env-service";
import { WebhookAttachments, webhookAsync } from "./common/webhook";
import { version } from "../package.json";
const log = logger;

log(`Starting smtp2http: ${version}`);

dotenv.config();
EnvService.instance.checkENVs();

const smtpDomainsString = EnvService.instance.getENV(
  EnvVariable.SmtpDomains,
) as string;

const smtpDomains = smtpDomainsString
  .split(",")
  .map((x) => x.trim().toLowerCase());

const server = new SMTPServer({
  onRcptTo(address, session, callback) {
    if (
      smtpDomains.every(
        (domain) => !address.address.toLowerCase().endsWith(domain),
      )
    ) {
      return callback(new Error("Not whitelisted receiver domain"));
    }

    return callback();
  },

  onData(stream, session, callback) {
    log("Email stream started ...");
    log("Session:");
    log(JSON.stringify(session));

    simpleParser(stream, {}, (err, parsed) => {
      if (err) {
        log(`Error: ${err}`, "error");
      } else {
        // Check attachments and remove them if available.
        const webhookAttachments: WebhookAttachments = {
          numberOfAttachments: parsed.attachments.length,
        };
        if (webhookAttachments.numberOfAttachments > 0) {
          parsed.attachments = [];
        }

        log(`Parsed: (${webhookAttachments.numberOfAttachments} attachments)`);
        log(JSON.stringify(parsed));

        webhookAsync(session, parsed, webhookAttachments)
          .then(() => {
            log("Webhook triggered");
          })
          .catch((err) => {
            log(`Webhook Error: ${err}`, "error");
          });
      }
    });

    stream.on("end", () => {
      log("Email stream ended");
      return callback();
    });
  },
  disabledCommands: ["AUTH"],
  banner: "Allow emails to " + smtpDomains.join(", "),
});

server.on("error", (err) => {
  log(`Error: ${err.message}`, "error");
});

server.listen(3000);

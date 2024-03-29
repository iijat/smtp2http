import axios from "axios";
import { ParsedMail } from "mailparser";
import { SMTPServerSession } from "smtp-server";
import { EnvService, EnvVariable } from "../services/env-service";

export type WebhookAttachments = {
  numberOfAttachments: number;
};

export const webhookAsync = async function (
  session: SMTPServerSession,
  parsed: ParsedMail,
  webhookAttachments: WebhookAttachments,
) {
  const url = EnvService.instance.getENV(EnvVariable.WebhookUrl);
  const header = EnvService.instance.getENV(
    EnvVariable.AuthApiHeader,
  ) as string;
  const key = EnvService.instance.getENV(EnvVariable.AuthApiKey) as string;

  await axios.post(
    url,
    {
      session,
      parsed,
      webhookAttachments,
    },
    {
      headers: {
        [header]: key,
      },
    },
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "../logger";

export enum EnvVariable {
  SmtpDomains = "SMTP_DOMAINS",
  WebhookUrl = "WEBHOOK_URL",
  AuthApiKey = "AUTH_API_KEY",
  AuthApiHeader = "AUTH_API_HEADER",
}

export class EnvService {
  static #instance: EnvService | undefined;

  static get instance(): EnvService {
    if (!EnvService.#instance) {
      EnvService.#instance = new EnvService();
    }

    return EnvService.#instance;
  }

  log = logger;

  #envVariables = [
    EnvVariable.SmtpDomains,
    EnvVariable.WebhookUrl,
    EnvVariable.AuthApiKey,
    EnvVariable.AuthApiHeader,
  ];

  checkENVs() {
    const check: [EnvVariable, boolean][] = [];

    this.log("Checking environment variables");

    for (const envVariable of this.#envVariables) {
      const available = !!process.env[envVariable];
      check.push([envVariable, available]);
      this.log(`${envVariable}: ${available ? "available" : "missing"}`);
    }

    if (check.some((x) => !x[1])) {
      throw new Error("Missing environment variables");
    }
  }

  getENV(env: EnvVariable): any {
    return process.env[env];
  }
}

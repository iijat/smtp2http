import { DateTime } from "luxon";

export const logger = function (
  message: string,
  type: "info" | "error" | undefined = "info",
) {
  const now = DateTime.now().toFormat("yyyy LLL dd, HH:mm:ss");

  if (type === "error") {
    console.error(`[smtp2http] - ${now} - ${message}`);
  } else {
    console.log(`[smtp2http] - ${now} - ${message}`);
  }
};

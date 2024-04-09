import { defineConfigEntry } from "../config/defs.ts";
import { layout } from "../layout/defs.ts";
import { description, enumerate, constant } from "../layout/mod.ts";

export const loggingStrategyConfigEntry = defineConfigEntry({
  kind: "logging-strategy",
  layout: layout(
    description("Controls log behavior in the app. Behaviors are defined and cannot be changed by other variables"),
    enumerate(
      layout(
        constant("NONE"),
        description("Logs are disabled and nothing is directed to stdout"),
      ),
      layout(
        constant("CLI_DEV"),
        description("Logs are configured for the best developer experience when debugging in the console"),
      ),
      layout(
        constant("BROWSER_DEV"),
        description("Logs are configured for the best developer experience when debugging in the browser dev tools"),
      ),
    ),
  ),
});
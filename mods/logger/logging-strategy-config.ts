import { defineConfigEntry } from "../config/defs.ts";
import { layout, description, enumerate, constant, InferLayout } from "../layout/mod.ts";

export const loggingStrategyConfigEntry = defineConfigEntry({
  kind: "logging-strategy",
  layout: layout(
    description("Controls log behavior in the app. Behaviors are defined and cannot be changed by other variables"),
    enumerate(
      layout(
        constant("none"),
        description("Logs are disabled and nothing is directed to stdout"),
      ),
      layout(
        constant("cli-dev"),
        description("Logs are configured for the best developer experience when debugging in the console"),
      ),
      layout(
        constant("browser-dev"),
        description("Logs are configured for the best developer experience when debugging in the browser dev tools"),
      ),
    ),
  ),
});

export type LoggingStrategy = InferLayout<typeof loggingStrategyConfigEntry['layout']>;

import { provideConfigEntryResolver } from "../config/config-entry-resolver.ts";
import { InferConfigEntryDefinition, defineConfigEntry } from "../config/defs.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { layout } from "../layout/defs.ts";
import { constant } from "../layout/traits/constant.ts";
import { description } from "../layout/traits/description.ts";
import { enumerate } from "../layout/traits/enumerate-type.ts";
import { key } from "../layout/traits/key.ts";

export const loggingStrategyConfigEntry = defineConfigEntry(
  layout(
    key("logging-strategy"),
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
);

export type LoggingStrategy = InferConfigEntryDefinition<typeof loggingStrategyConfigEntry>;

export function provideLoggingStrategy(resolver: ServiceResolver) {
  const configEntryResolver = resolver.resolve(provideConfigEntryResolver);
  return configEntryResolver.resolve(loggingStrategyConfigEntry);
}

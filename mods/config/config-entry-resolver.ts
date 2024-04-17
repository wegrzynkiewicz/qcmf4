import { ServiceResolver } from "../dependency/service-resolver.ts";
import { Breaker } from "../assert/breaker.ts";
import { InferLayout, LayoutResult } from "../layout/mod.ts";
import { UnknownLayout } from "../layout/mod.ts";
import { LayoutParser, provideLayoutParser } from "../layout/parsing.ts";
import { ConfigEntryDefinition, ConfigEntryExtractor } from "./defs.ts";
import { provideDenoEnvConfigEntryExtractor } from "./deno-env-config-extractor.ts";
import { formatNegativeLayoutResult, isValidResult } from "../layout/flow.ts";

export class ConfigEntryResolver {
  public constructor(
    private parser: LayoutParser,
    private extractors: ConfigEntryExtractor[],
  ) {}

  public resolve<T extends UnknownLayout>(entry: ConfigEntryDefinition<T>): InferLayout<T> {
    for (const extractor of this.extractors) {
      const value = extractor.get(entry);
      if (value === undefined) {
        continue;
      }
      let result: LayoutResult<InferLayout<T>>;
      try {
        result = this.parser.parse(value, entry.layout);
      } catch (error) {
        throw new Breaker("error-inside-config-entry-resolve-when-parsing", { entry, error, value });
      }
      if (isValidResult(result) === true) {
        return result.value;
      }
      const message = formatNegativeLayoutResult(result);
      throw new Breaker("invalid-config-entry-parsing", { message });
    }
    throw new Breaker("all-config-extractor-fail", { entry });
  }
}

export function provideConfigEntryResolver(resolver: ServiceResolver) {
  return new ConfigEntryResolver(
    resolver.resolve(provideLayoutParser),
    [
      resolver.resolve(provideDenoEnvConfigEntryExtractor),
    ],
  );
}

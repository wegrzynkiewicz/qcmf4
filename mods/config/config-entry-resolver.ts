import { ServiceResolver } from "../dependency/service-resolver.ts";
import { Breaker } from "../assert/breaker.ts";
import { LayoutParser, provideLayoutParser } from "../layout/parsing.ts";
import { ConfigEntryDefinition, ConfigEntryExtractor } from "./defs.ts";
import { formatNegativeLayoutResult } from "../layout/flow.ts";
import { PositiveLayoutResult } from "../layout/flow.ts";
import { provideQueryDenoConfigEntryExtractor } from "./deno-query.ts";
import { provideRequestDenoConfigEntryExtractor } from "./deno-request.ts";
import { provideDotEnvConfigEntryExtractor } from "./dotenv.ts";
import { provideBuiltInConfigEntryExtractor } from "./built-in.ts";

export class ConfigEntryResolver {
  public constructor(
    private parser: LayoutParser,
    private extractors: ConfigEntryExtractor[],
  ) {}

  public async resolve<T>(entry: ConfigEntryDefinition<T>): Promise<T> {
    for (const extractor of this.extractors) {
      const value = await extractor.get(entry);
      if (value === undefined) {
        continue;
      }
      const result = this.parser.parse(value, entry.layout);
      if (PositiveLayoutResult.is(result) === true) {
        return result.value;
      }
      const message = formatNegativeLayoutResult(result);
      throw new Breaker("invalid-config-entry-parsing", { message });
    }
    throw new Breaker("undefined-config-entry", { entryKey: entry.key });
  }
}

export function provideConfigEntryResolver(resolver: ServiceResolver) {
  return new ConfigEntryResolver(
    resolver.resolve(provideLayoutParser),
    [
      resolver.resolve(provideQueryDenoConfigEntryExtractor),
      resolver.resolve(provideDotEnvConfigEntryExtractor),
      resolver.resolve(provideRequestDenoConfigEntryExtractor),
      resolver.resolve(provideBuiltInConfigEntryExtractor ),
    ],
  );
}

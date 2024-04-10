import { ServiceResolver } from "../dependency/service-resolver.ts";
import { Breaker } from "../assert/breaker.ts";
import { InferLayout } from "../layout/mod.ts";
import { UnknownLayout } from "../layout/mod.ts";
import { LayoutParser, provideLayoutParser } from "../layout/parsing/defs.ts";
import { ConfigEntryDefinition, ConfigEntryExtractor } from "./defs.ts";
import { provideQueryEnvConfigEntryExtractor } from "./query-env-config-extractor.ts";
import { provideRequestEnvConfigEntryExtractor } from "./request-env-config-extractor.ts";

export class ConfigEntryResolver implements ConfigEntryExtractor {

  public constructor(
    private parser: LayoutParser,
    private extractors: ConfigEntryExtractor[],
  ) { }

  public async get<T extends UnknownLayout>(entry: ConfigEntryDefinition<T>): Promise<InferLayout<T> | undefined> {
    for (const extractor of this.extractors) {
      const value = await extractor.get(entry);
      if (value === undefined) {
        continue;
      }
      const parsed = this.parser.parse(value, entry.layout);
      return parsed as InferLayout<T>;
    }
  }

  public async resolve<T extends UnknownLayout>(entry: ConfigEntryDefinition<T>): Promise<InferLayout<T>> {
    const value = await this.get(entry);
    if (value === undefined) {
      throw new Breaker('cannot-resolve-config-entry', { kind: entry.kind });
    }
    return value;
  }
}

export function provideConfigEntryResolver(resolver: ServiceResolver) {
  return new ConfigEntryResolver(
    resolver.resolve(provideLayoutParser),
    [
      resolver.resolve(provideQueryEnvConfigEntryExtractor),
      resolver.resolve(provideRequestEnvConfigEntryExtractor),
    ]
  );
}

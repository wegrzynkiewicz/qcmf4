import { Breaker } from "../assert/breaker.ts";
import { ConfigEntryExtractor, ConfigEntryDefinition, UnknownConfigEntryDefinition } from "./defs.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";

export interface BuiltInMap extends Map<UnknownConfigEntryDefinition, unknown> {
  set<T>(entry: ConfigEntryDefinition<T>, value: T): this;
  get<T>(entry: ConfigEntryDefinition<T>): T;
}

export function provideBuiltInMap(): BuiltInMap {
  return new Map<UnknownConfigEntryDefinition, unknown>() as BuiltInMap;
}

export class BuiltInConfigEntryExtractor implements ConfigEntryExtractor {
  public constructor(
    public readonly map: BuiltInMap,
  ) { }

  public async get<T>(entry: ConfigEntryDefinition<T>): Promise<T> {
    try {
      const value = this.map.get(entry);
      return value as T;
    } catch (error) {
      throw new Breaker('error-inside-dotenv-config-entry-extractor', { entryKey: entry.key, error });
    }
  }
}

export function provideBuiltInConfigEntryExtractor(resolver: ServiceResolver) {
  return new BuiltInConfigEntryExtractor(
    resolver.resolve(provideBuiltInMap),
  );
}

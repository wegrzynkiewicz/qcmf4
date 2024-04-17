import { UnknownLayout } from "../layout/mod.ts";
import { ConfigEntryDefinition, ConfigEntryExtractor, toEnvVarName } from "./defs.ts";

export class DenoEnvConfigEntryExtractor implements ConfigEntryExtractor {
  public get<T extends UnknownLayout>(entry: ConfigEntryDefinition<T>): string | undefined {
    const variable = toEnvVarName(entry.kind);
    const value = Deno.env.get(variable);
    return value;
  }
}

export function provideDenoEnvConfigEntryExtractor() {
  return new DenoEnvConfigEntryExtractor();
}

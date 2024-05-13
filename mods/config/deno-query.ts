import { Breaker } from "../assert/breaker.ts";
import { UnknownConfigEntryDefinition } from "./defs.ts";
import { ConfigEntryExtractor, toEnvVarName } from "./defs.ts";

export class QueryDenoConfigEntryExtractor implements ConfigEntryExtractor {
  public async get(entry: UnknownConfigEntryDefinition): Promise<string | undefined> {
    const variable = toEnvVarName(entry.key);
    try {
      const status = await Deno.permissions.query({name: "env", variable});
      if (status.state === "granted") {
        return Deno.env.get(variable);
      }
      return undefined;
    } catch (error) {
      throw new Breaker('error-inside-query-deno-config-entry-extractor', { entryKey: entry.key, error });
    }
  }
}

export function provideQueryDenoConfigEntryExtractor() {
  return new QueryDenoConfigEntryExtractor();
}

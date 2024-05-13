import { Breaker } from "../assert/breaker.ts";
import { UnknownConfigEntryDefinition } from "./defs.ts";
import { ConfigEntryExtractor, toEnvVarName } from "./defs.ts";

export class RequestDenoConfigEntryExtractor implements ConfigEntryExtractor {
  public async get(entry: UnknownConfigEntryDefinition): Promise<string | undefined> {
    const variable = toEnvVarName(entry.key);
    try {
      const status = await Deno.permissions.request({name: "env", variable});
      if (status.state === "granted") {
        return Deno.env.get(variable);
      }
      return undefined;
    } catch (error) {
      throw new Breaker('error-inside-request-deno-config-entry-extractor', { entryKey: entry.key, error });
    }
  }
}

export function provideRequestDenoConfigEntryExtractor() {
  return new RequestDenoConfigEntryExtractor();
}

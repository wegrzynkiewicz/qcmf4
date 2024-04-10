import { UnknownLayout } from "../layout/mod.ts";
import { ConfigEntryDefinition, ConfigEntryExtractor, toEnvVarName } from "./defs.ts";

export class RequestEnvConfigEntryExtractor implements ConfigEntryExtractor {
  public async get<T extends UnknownLayout>(entry: ConfigEntryDefinition<T>): Promise<string | undefined> {
    const { kind } = entry;
    const variable = toEnvVarName(kind)
    const { state } = await Deno.permissions.request({ name: 'env', variable });
    if (state === "granted") {
      const value = Deno.env.get(variable);
      return value;
    }
    return undefined;
  }
}

export function provideRequestEnvConfigEntryExtractor() {
  return new RequestEnvConfigEntryExtractor();
}

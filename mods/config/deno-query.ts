import { Breaker } from "../assert/breaker.ts";
import { UnknownConfigContract } from "./defs.ts";
import { ConfigValueExtractor, toEnvVarName } from "./defs.ts";

export class DenoQueryingConfigValueExtractor implements ConfigValueExtractor {
  public async get(contract: UnknownConfigContract): Promise<string | undefined> {
    const variable = toEnvVarName(contract.key);
    try {
      const status = await Deno.permissions.query({name: "env", variable});
      if (status.state === "granted") {
        return Deno.env.get(variable);
      }
      return undefined;
    } catch (error) {
      throw new Breaker('error-inside-deno-querying-config-contract-extractor', { contractKey: contract.key, error });
    }
  }
}

export function provideDenoQueryingConfigValueExtractor() {
  return new DenoQueryingConfigValueExtractor();
}

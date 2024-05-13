import { Breaker } from "../assert/breaker.ts";
import { UnknownConfigContract } from "./defs.ts";
import { ConfigValueExtractor, toEnvVarName } from "./defs.ts";

export class DenoRequestingConfigValueExtractor implements ConfigValueExtractor {
  public async get(contract: UnknownConfigContract): Promise<string | undefined> {
    const variable = toEnvVarName(contract.key);
    try {
      const status = await Deno.permissions.request({name: "env", variable});
      if (status.state === "granted") {
        return Deno.env.get(variable);
      }
      return undefined;
    } catch (error) {
      throw new Breaker('error-inside-deno-requesting-config-contract-extractor', { contractKey: contract.key, error });
    }
  }
}

export function provideDenoRequestingConfigValueExtractor() {
  return new DenoRequestingConfigValueExtractor();
}

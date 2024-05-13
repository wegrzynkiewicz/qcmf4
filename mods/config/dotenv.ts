import { Breaker } from "../assert/breaker.ts";
import { ConfigValueExtractor, UnknownConfigContract, toEnvVarName } from "./defs.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { readDotEnvFiles } from "../deps.ts";

export type DotEnvMap = Map<string, string>;

export function provideDotEnvMap() {
  return new Map<string, string>();
}

export async function feedDotEnvMap(resolver: ServiceResolver): Promise<void> {
  const dotenvMap = resolver.resolve(provideDotEnvMap);
  try {
    const envs = await readDotEnvFiles({
      envPath: ".env",
      defaultsPath: "",
      examplePath: "",
      allowEmptyValues: true,
    });
    for (const [key, value] of Object.entries(envs)) {
      dotenvMap.set(key, value);
    }
  } catch (_error: unknown) {
    // nothing
  }
}

export class DotEnvConfigValueExtractor implements ConfigValueExtractor {
  public readonly name = "dotenv";

  public constructor(
    public readonly map: DotEnvMap,
  ) { }

  public async get(contract: UnknownConfigContract): Promise<string | undefined> {
    const variable = toEnvVarName(contract.key);
    try {
      const value = this.map.get(variable);
      return value;
    } catch (error) {
      throw new Breaker('error-inside-dotenv-config-contract-extractor', { contractKey: contract.key, error });
    }
  }
}

export function provideDotEnvConfigValueExtractor(resolver: ServiceResolver) {
  return new DotEnvConfigValueExtractor(
    resolver.resolve(provideDotEnvMap),
  );
}

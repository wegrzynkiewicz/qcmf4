import { Breaker } from "../assert/breaker.ts";
import { ConfigValueExtractor, ConfigContract, UnknownConfigContract, ConfigContractMap } from "./defs.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";

export function provideBuiltInMap(): ConfigContractMap {
  return new Map<UnknownConfigContract, unknown>() as ConfigContractMap;
}

export class BuiltInConfigValueExtractor implements ConfigValueExtractor {
  public readonly name = "built-in";

  public constructor(
    public readonly map: ConfigContractMap,
  ) { }

  public async get<T>(contract: ConfigContract<T>): Promise<T> {
    try {
      const value = this.map.get(contract);
      return value as T;
    } catch (error) {
      throw new Breaker('error-inside-dotenv-config-contract-extractor', { contractKey: contract.key, error });
    }
  }
}

export function provideBuiltInConfigValueExtractor(resolver: ServiceResolver) {
  return new BuiltInConfigValueExtractor(
    resolver.resolve(provideBuiltInMap),
  );
}

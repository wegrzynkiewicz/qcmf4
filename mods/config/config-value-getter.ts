import { ServiceResolver } from "../dependency/service-resolver.ts";
import { ConfigContract, UnknownConfigValueResult, provideConfigContractRegistry } from "./defs.ts";
import { provideConfigValueResolver } from "./config-value-resolver.ts";
import { Breaker, formatError } from "../assert/breaker.ts";
import { UnknownConfigContract } from "./defs.ts";

export type ConfigValuesMap = Map<UnknownConfigContract, UnknownConfigValueResult>;

export function provideConfigValuesMap(): ConfigValuesMap {
  return new Map();
}

export async function feedConfigValuesMap(resolver: ServiceResolver) {
  const configContractRegistry = resolver.resolve(provideConfigContractRegistry);
  const configValueResolver = resolver.resolve(provideConfigValueResolver);
  const map = resolver.resolve(provideConfigValuesMap);

  const results: unknown[] = [];
  for (const contract of configContractRegistry.entries.values()) {
    try {
      const value = await configValueResolver.resolve(contract);
      map.set(contract, value);
    } catch (error) {
      const message = formatError(error);
      results.push({ configContractKey: contract.key, message });
    }
  }
  if (results.length > 0) {
    throw new Breaker("config-values-invalid", { results });
  }
}

export class ConfigValueGetter {
  public constructor(
    private readonly map: ConfigValuesMap,
  ) { }

  public get<T>(contract: ConfigContract<T>): T {
    const result = this.map.get(contract);
    if (result?.value === undefined) {
      throw new Breaker('undefined-config-value', { contractKey: contract.key });
    }
    return result.value as T;
  }
}

export function provideConfigValueGetter(resolver: ServiceResolver) {
  return new ConfigValueGetter(
    resolver.resolve(provideConfigValuesMap),
  );
}

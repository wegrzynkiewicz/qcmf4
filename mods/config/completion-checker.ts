import { Breaker, formatError } from "../assert/breaker.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { provideConfigValueResolver } from "./config-value-resolver.ts";
import { provideConfigContractRegistry } from "./defs.ts";

interface ConfigCompletionChecker {
  check: () => Promise<void>;
}

export function provideConfigCompletionChecker(resolver: ServiceResolver): ConfigCompletionChecker {
  const configContractRegistry = resolver.resolve(provideConfigContractRegistry);
  const configValueResolver = resolver.resolve(provideConfigValueResolver);
  const check = async () => {
    const results: unknown[] = [];
    for (const contract of configContractRegistry.entries.values()) {
      try {
        await configValueResolver.resolve(contract);
      } catch (error) {
        const message = formatError(error);
        results.push({ configContractKey: contract.key, message });
      }
    }
    if (results.length > 0) {
      throw new Breaker("config-entries-invalid", { results });
    }
  };
  return { check };
}

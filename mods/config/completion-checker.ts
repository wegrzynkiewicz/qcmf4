import { Breaker, formatError } from "../assert/breaker.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { provideConfigEntryResolver } from "./config-entry-resolver.ts";
import { provideConfigEntryRegistry } from "./defs.ts";

interface CompletionChecker {
  check: () => Promise<void>;
}

export function provideCompletionChecker(resolver: ServiceResolver): CompletionChecker {
  const entryRegistry = resolver.resolve(provideConfigEntryRegistry);
  const entryResolver = resolver.resolve(provideConfigEntryResolver);
  const check = async () => {
    const results: unknown[] = [];
    for (const entry of entryRegistry.entries.values()) {
      try {
        await entryResolver.resolve(entry);
      } catch (error) {
        const message = formatError(error);
        results.push({ configEntryKey: entry.key, message });
      }
    }
    if (results.length > 0) {
      throw new Breaker("config-entries-invalid", { results });
    }
  };
  return { check };
}

import { Breaker } from "../assert/breaker.ts";
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
    const unsetEntries: string[] = [];
    for (const entry of entryRegistry.entries.values()) {
      const value = await entryResolver.get(entry);
      if (value === undefined) {
        unsetEntries.push(entry.kind);
      }
    }
    if (unsetEntries.length > 0) {
      throw new Breaker("not-all-config-entries-was-set", { unsetEntries });
    }
  }
  return { check };
}

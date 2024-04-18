import { Breaker } from "../assert/breaker.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { provideConfigEntryResolver } from "./config-entry-resolver.ts";
import { provideConfigEntryRegistry } from "./defs.ts";

interface CompletionChecker {
  check: () => void;
}

export function provideCompletionChecker(resolver: ServiceResolver): CompletionChecker {
  const entryRegistry = resolver.resolve(provideConfigEntryRegistry);
  const entryResolver = resolver.resolve(provideConfigEntryResolver);
  const check = () => {
    const results: unknown[] = [];
    for (const entry of entryRegistry.entries.values()) {
      try {
        entryResolver.resolve(entry);
      } catch (error) {
        results.push({ configEntryName: entry.kind, error });
      }
    }
    if (results.length > 0) {
      throw new Breaker("config-entries-invalid", { results });
    }
  };
  return { check };
}

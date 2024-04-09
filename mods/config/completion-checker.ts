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
    for (const entry of entryRegistry.entries.values()) {
      entryResolver.resolve(entry);
    }
  }
  return { check };
}

import { Breaker } from "../assert/breaker.ts";
import { ServiceResolver } from "./service-resolver.ts";

export interface Scope<TIdentifier> {
  kind: string;
  identifier: TIdentifier;
  resolver: ServiceResolver;
}
export type UnknownScope = Scope<unknown>;

export function provideScope(): UnknownScope {
  throw new Breaker("scope-must-be-injected");
}

export function defineScope<TIdentifier>(
  kind: string,
  identifier: TIdentifier,
  parent: UnknownScope | null,
) {
  const resolver = new ServiceResolver(parent?.resolver);
  const scope: Scope<TIdentifier> = {
    kind,
    identifier,
    resolver,
  };
  resolver.inject(provideScope, scope);
  return scope;
}

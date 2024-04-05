import { Breaker } from "../assert/breaker.ts";
import { ServiceResolver } from "./service-resolver.ts";

export interface Context<TIdentifier> {
  description: string;
  identifier: TIdentifier;
  resolver: ServiceResolver;
}

export type GlobalContext = Context<null>;

export function provideGlobalContext(): GlobalContext {
  throw new Breaker("global-context-must-be-injected");
}

export function createGlobalContext(): GlobalContext {
  const resolver = new ServiceResolver();
  const context: GlobalContext = {
    description: "global-context",
    identifier: null,
    resolver,
  };
  resolver.inject(provideGlobalContext, context);
  return context;
}

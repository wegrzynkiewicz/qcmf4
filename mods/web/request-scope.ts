import { Scope, provideScope, defineScope } from "../dependency/scope.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { UnknownEndpointContract } from "../endpoint/defs.ts";
import { provideLogger } from "../logger/defs.ts";
import { provideWebRequest, provideEndpointContract } from "./defs.ts";

export type WebRequestScope = Scope<{ requestId: string }>;

export interface WebRequestScopeInput {
  contract: UnknownEndpointContract;
  request: Request;
  requestId: string;
}

export interface WebRequestScopeManager {
  createWebRequestScope(input: WebRequestScopeInput): WebRequestScope;
}

export function provideWebRequestScopeManager(resolver: ServiceResolver): WebRequestScopeManager {
  const parentScope = resolver.resolve(provideScope);
  const parentLogger = resolver.resolve(provideLogger);

  const createWebRequestScope = (input: WebRequestScopeInput) => {
    const { contract, request, requestId } = input;
    const webRequestScope = defineScope('web-request', { requestId }, parentScope);
    const { resolver } = webRequestScope;

    resolver.inject(provideWebRequest, request);
    resolver.inject(provideEndpointContract, contract);

    const endpoint = contract.key;
    const logger = parentLogger.extend('REQ', { endpoint, requestId });
    resolver.inject(provideLogger, logger);

    return webRequestScope;
  }

  return { createWebRequestScope }
}

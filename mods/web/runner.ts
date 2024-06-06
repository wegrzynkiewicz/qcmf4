import { Breaker } from "../assert/breaker.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { notFoundErrorEndpointResponseContract } from "../endpoint/build-in.ts";
import { jsonResponse } from "../endpoint/responses.ts";
import { WebHandler } from "./defs.ts";
import { Router, provideRouter } from "./router.ts";
import { WebRequestScopeManager, provideWebRequestScopeManager } from "./request-scope.ts";

export class WebHandlerRunner implements WebHandler {
  public constructor(
    private readonly requestScopeManager: WebRequestScopeManager,
    private readonly router: Router,
  ) { }

  public async handle(request: Request): Promise<Response> {
    const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
    const route = this.router.match(request);
    if (route === null) {
      const error = "not-found-endpoint";
      const response = jsonResponse(notFoundErrorEndpointResponseContract, { error });
      response.headers.set('x-request-id', requestId);
      return response;
    }
    const { contract, provider } = route;
    const { resolver } = this.requestScopeManager.createWebRequestScope({ contract, request, requestId });
    try {
      const handler = resolver.resolve(provider);
      const response = await handler.handle(request);
      response.headers.set('x-request-id', requestId);
      return response;
    } catch (error: unknown) {
      throw new Breaker("error-inside-router", { error, contractKey: contract.key, requestId });
    }
  }
}

export function provideWebHandlerRunner(resolver: ServiceResolver) {
  return new WebHandlerRunner(
    resolver.resolve(provideWebRequestScopeManager),
    resolver.resolve(provideRouter),
  );
}

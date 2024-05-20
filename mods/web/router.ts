import { Breaker } from "../assert/breaker.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { notFoundErrorEndpointResponseContract } from "../endpoint/build-in.ts";
import { jsonResponse } from "../endpoint/responses.ts";
import { WebServerHandler, WebServerRouteMap, provideWebServerRouteMap } from "./defs.ts";
import { WebRequestScopeManager, provideWebRequestScopeManager } from "./web-request-scope.ts";

export class Router implements WebServerHandler {

  public constructor(
    private readonly requestScopeManager: WebRequestScopeManager,
    private readonly routes: WebServerRouteMap,
  ) { }

  public async handle(request: Request): Promise<Response> {
    for (const [contract, provider] of this.routes.entries()) {
      const { method, params } = contract.request;
      if (request.method !== method || params.urlPattern.test(request.url) === false) {
        continue;
      }
      const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
      const { resolver } = this.requestScopeManager.createWebRequestScope({
        contract,
        request,
        requestId,
      });
      try {
        const handler = resolver.resolve(provider);
        const response = await handler.handle(request);
        response.headers.set('x-request-id', requestId);
        return response;
      } catch (error: unknown) {
        throw new Breaker("error-inside-router", { error, contractKey: contract.key, requestId });
      }
    }
    const payload = {
      error: "not-found-endpoint",
    };
    return jsonResponse(notFoundErrorEndpointResponseContract, payload);
  }
}

export function provideWebRouter(resolver: ServiceResolver): Router {
  return new Router(
    resolver.resolve(provideWebRequestScopeManager),
    resolver.resolve(provideWebServerRouteMap),
  );
}

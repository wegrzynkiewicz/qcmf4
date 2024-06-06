import { Provider } from "../dependency/service-resolver.ts";
import { UnknownEndpointContract } from "../endpoint/defs.ts";
import { WebHandler } from "./defs.ts";

export interface Route {
  contract: UnknownEndpointContract;
  provider: Provider<WebHandler>;
}

export class Router {
  private routes: Route[] = [];

  public add(contract: UnknownEndpointContract, provider: Provider<WebHandler>) {
    const route: Route = { contract, provider };
    this.routes.push(route);
  }

  public match(request: Request): Route | null {
    for (const route of this.routes) {
      const { method, params } = route.contract.request;
      if (request.method === method && params.urlPattern.test(request.url)) {
        return route;
      }
    }
    return null;
  }
}

export function provideRouter() {
  return new Router();
}

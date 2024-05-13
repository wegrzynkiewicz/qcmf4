import { Breaker } from "../assert/breaker.ts";
import { WebServerHandler } from "./defs.ts";

export interface RouteBinding {
  handler: EPHandler;
  route: EPRoute;
}

export class Router implements WebServerHandler {
  private readonly bindings: RouteBinding[] = [];

  public add(route: EPRoute, handler: EPHandler): void {
    const binding: RouteBinding = { handler, route };
    this.bindings.push(binding);
  }

  public async handle(req: Request): Promise<Response> {
    for (const { handler, route } of this.bindings) {
      const { method, urlPattern } = route;
      if (req.method === method && urlPattern.test(req.url)) {
        const match = urlPattern.exec(req.url);
        if (match === null) {
          throw new Breaker("cannot-match-url-params", { req, urlPattern });
        }
        const context: EPContext = {
          params: { ...match.pathname.groups },
          request: req,
          url: new URL(req.url),
        };
        try {
          const response = await handler.handle(context);
          return response;
        } catch (error: unknown) {
          throw new Breaker("error-inside-router", {
            error,
            method,
            urlPattern: {
              pathname: urlPattern.pathname,
            },
          });
        }
      }
    }
    const payload = {
      error: "url-not-match",
    };
    const response = Response.json(payload, { status: 404 });
  }
}

export function provideWebRouter(): Router {
  return new Router();
}

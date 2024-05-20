import { Breaker } from "../assert/breaker.ts";
import { Provider } from "../dependency/service-resolver.ts";
import { UnknownEndpointContract } from "../endpoint/defs.ts";

export interface WebServerHandler {
  handle(req: Request): Promise<Response>;
}

export interface WebServerConfig {
  hostname: string;
  name: string;
  port: number;
}

export function provideWebServerConfig(): WebServerConfig {
  throw new Breaker('web-server-config-must-be-injected');
}

export function provideWebRequest(): Request {
  throw new Breaker('web-request-must-be-injected');
}

export function provideEndpointContract(): UnknownEndpointContract {
  throw new Breaker('endpoint-contract-must-be-injected');
}

export function provideWebServerRouteMap() {
  return new Map<UnknownEndpointContract, Provider<WebServerHandler>>();
}
export type WebServerRouteMap = ReturnType<typeof provideWebServerRouteMap>;

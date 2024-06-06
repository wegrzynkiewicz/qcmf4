import { Breaker } from "../assert/breaker.ts";
import { UnknownEndpointContract } from "../endpoint/defs.ts";

export interface WebHandler {
  handle(req: Request): Promise<Response>;
}

export interface WebConfig {
  hostname: string;
  name: string;
  port: number;
}

export function provideWebConfig(): WebConfig {
  throw new Breaker('web-server-config-must-be-injected');
}

export function provideWebRequest(): Request {
  throw new Breaker('web-request-must-be-injected');
}

export function provideEndpointContract(): UnknownEndpointContract {
  throw new Breaker('endpoint-contract-must-be-injected');
}

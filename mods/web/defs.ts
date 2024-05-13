import { Breaker } from "../assert/breaker.ts";

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

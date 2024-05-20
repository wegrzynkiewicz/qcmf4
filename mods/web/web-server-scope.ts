import { provideConfigValueGetter } from "../config/config-value-getter.ts";
import { ConfigContract } from "../config/defs.ts";
import { Scope, defineScope, provideScope } from "../dependency/scope.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { provideLogger } from "../logger/defs.ts";
import { WebServerConfig, provideWebServerConfig } from "./defs.ts";

export type WebServerScope = Scope<{ name: string }>;

export interface WebServerScopeInput {
  hostname: ConfigContract<string>;
  name: string;
  port: ConfigContract<number>;
}

export interface WebServerScopeManager {
  createWebServerScope(input: WebServerScopeInput): WebServerScope;
}

export function provideWebServerScopeManager(resolver: ServiceResolver): WebServerScopeManager {
  const parentScope = resolver.resolve(provideScope);
  const parentLogger = resolver.resolve(provideLogger);

  const createWebServerScope = (input: WebServerScopeInput) => {
    const { hostname, name, port } = input;
    const webServerScope = defineScope('web', { name }, parentScope);
    const { resolver } = webServerScope;

    const configValueGetter = resolver.resolve(provideConfigValueGetter);
    const webServerConfig: WebServerConfig = {
      hostname: configValueGetter.get(hostname),
      name,
      port: configValueGetter.get(port),
    }
    resolver.inject(provideWebServerConfig, webServerConfig);

    const logger = parentLogger.extend('WEB', { web: name });
    resolver.inject(provideLogger, logger);

    return webServerScope;
  }

  return { createWebServerScope }
}

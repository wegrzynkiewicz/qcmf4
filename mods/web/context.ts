import { provideConfigValueGetter } from "../config/config-value-getter.ts";
import { ConfigContract } from "../config/defs.ts";
import { Scope, defineScope, provideScope } from "../dependency/scope.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { provideLogger } from "../logger/defs.ts";
import { provideLoggerFactory } from "../logger/logger-factory.ts";
import { WebServerConfig, provideWebServerConfig } from "./defs.ts";

export type WebServerScope = Scope<{ name: string }>;

export interface WebServerScopeInput {
  hostname: ConfigContract<string>;
  name: string;
  port: ConfigContract<number>;
}

export interface WebServerScopeManager {
  createScope(input: WebServerScopeInput): WebServerScope;
}

export function provideWebServerScopeManager(resolver: ServiceResolver): WebServerScopeManager {
  const parent = resolver.resolve(provideScope);

  const createScope = (input: WebServerScopeInput) => {
    const { hostname, name, port } = input;
    const webServerScope = defineScope('web', { name }, parent);
    const { resolver } = webServerScope;

    const configValueGetter = resolver.resolve(provideConfigValueGetter);
    const webServerConfig: WebServerConfig = {
      hostname: configValueGetter.get(hostname),
      name,
      port: configValueGetter.get(port),
    }
    resolver.inject(provideWebServerConfig, webServerConfig);

    const loggerFactory = resolver.resolve(provideLoggerFactory);
    const logger = loggerFactory.createLogger('WEB', { web: name });
    resolver.inject(provideLogger, logger);

    return webServerScope;
  }

  return { createScope }
}

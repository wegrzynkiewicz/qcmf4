import { defineConfig } from "../config/defs.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { layout } from "../layout/defs.ts";
import { description } from "../layout/traits/description.ts";
import { key } from "../layout/traits/key.ts";
import { number } from "../layout/traits/number/number-type.ts";
import { string } from "../layout/traits/string/string-type.ts";
import { provideWebServerScopeManager } from "../web/web-server-scope.ts";
import { provideWebServer } from "../web/server.ts";
import { provideWebServerRouteMap } from "../web/defs.ts";
import { healthEndpointContract } from "./health/health-endpoint.ts";
import { provideHealthEndpointHandler } from "./health/health-handler.ts";

export const mainWebServerHostnameConfigContract = defineConfig(
  layout(
    key(`main-web-hostname`),
    description(`The hostname of the main web server`),
    string()
  ),
);

export const mainWebServerPortConfigContract = defineConfig(
  layout(
    key(`main-web-port`),
    description(`The port of the main web server`),
    number()
  ),
);

export async function runMainWebServer(parentResolver: ServiceResolver) {
  const webServerScopeManager = parentResolver.resolve(provideWebServerScopeManager);
  const { resolver } = webServerScopeManager.createWebServerScope({
    hostname: mainWebServerHostnameConfigContract,
    name: 'main',
    port: mainWebServerPortConfigContract,
  });

  const routes = resolver.resolve(provideWebServerRouteMap);

  routes.set(healthEndpointContract, provideHealthEndpointHandler);

  const webServer = resolver.resolve(provideWebServer);
  await webServer.listen();
}

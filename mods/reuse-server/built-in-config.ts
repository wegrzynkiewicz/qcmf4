import { provideBuiltInMap } from "../config/built-in.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { loggingStrategyConfigContract } from "../logger/logging-strategy-config.ts";
import { mainWebServerHostnameConfigContract, mainWebServerPortConfigContract } from "./main-web-server.ts";

export function feedBuiltInConfig(resolver: ServiceResolver) {
  const map = resolver.resolve(provideBuiltInMap);

  map.set(loggingStrategyConfigContract, "cli-dev");
  map.set(mainWebServerHostnameConfigContract, "0.0.0.0");
  map.set(mainWebServerPortConfigContract, 8080);
}

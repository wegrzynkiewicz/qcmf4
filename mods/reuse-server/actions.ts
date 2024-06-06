import { ServiceResolver } from "../dependency/service-resolver.ts";
import { provideActionHandlerProviderMap } from "../flow/action.ts";
import { healthActionContract, provideHealthActionHandler } from "./health/health-handler.ts";

export function feedActions(resolver: ServiceResolver) {
  const map = resolver.resolve(provideActionHandlerProviderMap);

  map.set(healthActionContract, provideHealthActionHandler);
}

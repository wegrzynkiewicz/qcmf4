import { displayError } from "../assert/breaker.ts";
import { feedDotEnvMap } from "../config/dotenv.ts";
import { feedConfigValuesMap } from "../config/config-value-getter.ts";
import { feedBuiltInConfig } from "./built-in-config.ts";
import { defineScope } from "../dependency/scope.ts";
import { runMainWebServer } from "./main-web-server.ts";

async function bootstrap() {
  try {
    const globalScope = defineScope('global', null, null);
    const { resolver } = globalScope;

    feedBuiltInConfig(resolver);
    await feedDotEnvMap(resolver);
    await feedConfigValuesMap(resolver);

    await runMainWebServer(resolver);

  } catch (error) {
    displayError(error);
  }
}

bootstrap();

import { createGlobalContext } from "./dependency/context.ts";
import { provideCompletionChecker } from "./config/completion-checker.ts";
import "./logger/logging-strategy-config.ts"
import { displayError } from "./assert/breaker.ts";

async function bootstrap() {
  try {
    const globalContext = createGlobalContext();
    const { resolver } = globalContext;

    const completionChecker = resolver.resolve(provideCompletionChecker);
    await completionChecker.check();
  } catch (error) {
    displayError(error);
  }
}

bootstrap();

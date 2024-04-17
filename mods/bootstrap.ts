import { createGlobalContext } from "./dependency/context.ts";
import { provideCompletionChecker } from "./config/completion-checker.ts";
import { displayError } from "./assert/breaker.ts";

function bootstrap() {
  try {
    const globalContext = createGlobalContext();
    const { resolver } = globalContext;

    const completionChecker = resolver.resolve(provideCompletionChecker);
    completionChecker.check();
  } catch (error) {
    displayError(error);
  }
}

bootstrap();

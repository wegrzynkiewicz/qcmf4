import { createGlobalContext } from "./dependency/context.ts";
import { provideCompletionChecker } from "./config/completion-checker.ts";
import "./logger/logging-strategy-config.ts"

function start() {
  const globalContext = createGlobalContext();
  const { resolver } = globalContext;

  const completionChecker = resolver.resolve(provideCompletionChecker);
  completionChecker.check();
}

start();

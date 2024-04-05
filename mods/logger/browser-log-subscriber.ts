import { Log, LogFilter, LogSubscriber, mapSeverityToConsoleMethod } from "./defs.ts";

export class BrowserLogSubscriber implements LogSubscriber {
  public constructor(
    private readonly filter: LogFilter,
  ) {}

  public subscribe(log: Log): void {
    if (this.filter.filter(log) === false) {
      return;
    }
    const { data, message, severity, topic } = log;
    const method = mapSeverityToConsoleMethod[severity];
    method.call(console, `[${topic}] ${message}`, data);
  }
}

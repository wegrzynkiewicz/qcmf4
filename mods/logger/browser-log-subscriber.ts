import { Log, LogFilter, LogSubscriber } from "./defs.ts";

export class BrowserLogSubscriber implements LogSubscriber {
  public constructor(
    private readonly filter: LogFilter,
  ) {}

  public subscribe(log: Log): void {
    if (this.filter.filter(log) === false) {
      return;
    }
    const { data, message, severity, topic } = log;
    severity.display.call(console, `[${topic}] ${message}`, data);
  }
}

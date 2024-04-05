import { Log, LogFilter, mapSeverityToConsoleMethod } from "./defines.ts";
import { LogBusSubscriber } from "./log-bus.ts";

export class BrowserLogSubscriber implements LogBusSubscriber {
  public constructor(
    private readonly filter: LogFilter,
  ) {}

  public subscribe(log: Log): void {
    if (this.filter.filter(log) === false) {
      return;
    }
    const { channel, data, severity, message } = log;
    const method = mapSeverityToConsoleMethod[severity];
    method.call(console, `[${channel}] ${message}`, data);
  }
}

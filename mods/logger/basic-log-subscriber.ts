import { Log, LogFilter, LogFormatter } from "./defs.ts";
import { LogBusSubscriber } from "./log-bus.ts";

export class BasicLogSubscriber implements LogBusSubscriber {
  public constructor(
    private readonly filter: LogFilter,
    private readonly formatter: LogFormatter,
  ) {}

  public subscribe(log: Log): void {
    if (this.filter.filter(log) === false) {
      return;
    }
    const formatted = this.formatter.format(log);
    console.log(formatted);
  }
}

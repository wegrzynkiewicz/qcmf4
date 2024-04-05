import { Log, LogFilter, LogFormatter, LogSubscriber } from "./defs.ts";

export class BasicLogSubscriber implements LogSubscriber {
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

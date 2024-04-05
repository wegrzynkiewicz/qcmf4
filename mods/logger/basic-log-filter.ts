import { Log, LogFilter, LogSeverity } from "./defines.ts";

export class BasicLogFilter implements LogFilter {
  public constructor(
    public readonly minSeverity: LogSeverity,
  ) {}

  public filter(log: Log): boolean {
    if (log.severity < this.minSeverity) {
      return false;
    }
    return true;
  }
}

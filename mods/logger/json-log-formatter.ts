import { formatError } from "../assert/breaker.ts";
import { Log, LogFormatter } from "./defs.ts";

export class JSONLogFormatter implements LogFormatter {
  public format(log: Log): string {
    const { data, date, message, severity, topic } = log;
    const json = JSON.stringify({
      data: {
        ...data,
        error: data.error ? formatError(data.error) : undefined,
      },
      date,
      message,
      severity: severity.name,
      topic,
    });
    return json;
  }
}

import { Log, LogFormatter, logSeverityNames } from "./defs.ts";

export class JSONLogFormatter implements LogFormatter {
  public format(log: Log): string {
    const { data, date, message, severity, topic } = log;
    const { error, ...others } = data ?? {};
    const errorStack = error instanceof Error ? error.stack : error;
    const json = JSON.stringify({
      data: {
        ...others,
        error: errorStack,
      },
      date,
      message,
      severity: logSeverityNames[severity],
      topic,
    });
    return json;
  }
}

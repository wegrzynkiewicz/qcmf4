import { formatError } from "../assert/breaker.ts";
import { indent } from "../useful/strings.ts";
import { bold, brightBlue, dim } from "../deps.ts";
import { Log, LoggerData } from "./defs.ts";

export class PrettyLogFormatter {
  public format(log: Log): string {
    const { data, date, message, severity, topic } = log;
    const { name, colorize } = severity;
    const severityText = colorize(name);
    const dateTime = date.toISOString();
    const params = this.formatData(data);
    const header = `${dateTime} [${bold(severityText)}] [${bold(topic)}] ${brightBlue(bold(message))}`;
    return `${header}${dim(params)}`;
  }

  private formatData(data: LoggerData): string {
    if (Object.keys(data).length === 0) {
      return `\n`;
    }
    const { error, ...others } = data;
    let msg = ` `;
    if (Object.keys(others).length > 0) {
      const json = JSON.stringify(others);
      msg += json;
    }
    if (error instanceof Error) {
      msg += `\n${indent(formatError(error), "  ")}\n`;
    }
    return msg;
  }
}

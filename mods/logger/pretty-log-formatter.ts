import { bold, brightBlue, dim } from "../deps.ts";
import { Log, LoggerData, logSeverityNames, mapSeverityToConsoleColor } from "./defines.ts";

export function indent(data: string, delimiter: string): string {
  return data
    .split("\n")
    .map((line) => `${delimiter}${line}`)
    .join("\n");
}

export class PrettyLogFormatter {
  public format(log: Log): string {
    const { channel, data, date, severity, message } = log;
    const severityName = logSeverityNames[severity];
    const severityText = mapSeverityToConsoleColor[severity](severityName);
    const dateTime = date.toISOString();
    const params = this.formatData(data);
    const header = `${dateTime} [${bold(severityText)}] [${bold(channel)}] ${brightBlue(bold(message))}`;
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
      msg += `\n${indent(error.stack ?? "", "  ")}\n`;
    }
    return msg;
  }
}

import { Log, LogChannel, Logger, LoggerData, LogSeverity } from "./defs.ts";

export class BasicLogger implements Logger {
  public constructor(
    private readonly bus: LogChannel,
    private readonly topic: string,
    private readonly params: LoggerData,
  ) {}

  private log(severity: LogSeverity, message: string, data: LoggerData = {}) {
    const log: Log = {
      topic: this.topic,
      date: new Date(),
      severity,
      message,
      data: {
        ...this.params,
        ...data,
      },
    };
    this.bus.emit(log);
  }

  public silly(message: string, data?: LoggerData): void {
    this.log(LogSeverity.SILLY, message, data);
  }

  public debug(message: string, data?: LoggerData): void {
    this.log(LogSeverity.DEBUG, message, data);
  }

  public info(message: string, data?: LoggerData): void {
    this.log(LogSeverity.INFO, message, data);
  }

  public notice(message: string, data?: LoggerData): void {
    this.log(LogSeverity.NOTICE, message, data);
  }

  public warn(message: string, data?: LoggerData): void {
    this.log(LogSeverity.WARN, message, data);
  }

  public error(message: string, data?: LoggerData): void {
    this.log(LogSeverity.ERROR, message, data);
  }

  public fatal(message: string, data?: LoggerData): void {
    this.log(LogSeverity.FATAL, message, data);
  }
}

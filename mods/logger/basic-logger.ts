import {
  DEBUG,
  ERROR,
  FATAL,
  INFO,
  Log,
  LogChannel,
  Logger,
  LoggerData,
  LogSeverity,
  NOTICE,
  SILLY,
  WARN,
} from "./defs.ts";

export class BasicLogger implements Logger {
  public constructor(
    private readonly bus: LogChannel,
    private readonly topic: string,
    private readonly params: LoggerData,
  ) {}

  public extend(topic: string, params?: LoggerData | undefined): Logger {
    return new BasicLogger(this.bus, topic, { ...this.params, ...params });
  }

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
    this.log(SILLY, message, data);
  }

  public debug(message: string, data?: LoggerData): void {
    this.log(DEBUG, message, data);
  }

  public info(message: string, data?: LoggerData): void {
    this.log(INFO, message, data);
  }

  public notice(message: string, data?: LoggerData): void {
    this.log(NOTICE, message, data);
  }

  public warn(message: string, data?: LoggerData): void {
    this.log(WARN, message, data);
  }

  public error(message: string, data?: LoggerData): void {
    this.log(ERROR, message, data);
  }

  public fatal(message: string, data?: LoggerData): void {
    this.log(FATAL, message, data);
  }
}

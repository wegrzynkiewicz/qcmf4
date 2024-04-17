import { Breaker } from "../assert/breaker.ts";
import { Subscriber } from "../dependency/channel.ts";
import { Channel } from "../dependency/channel.ts";
import { brightCyan, brightRed, brightYellow, dim } from "../deps.ts";

export type LoggerData = Record<string, unknown>;

export type ColorLog = (message: string) => string;

export interface LogSeverity {
  colorize: ColorLog;
  display: (...args: unknown[]) => void;
  level: number;
  name: string;
}

export const SILLY: LogSeverity = { name: "SILLY", level: 1, display: console.debug, colorize: dim };
export const DEBUG: LogSeverity = { name: "DEBUG", level: 2, display: console.debug, colorize: dim };
export const INFO: LogSeverity = { name: "INFO", level: 3, display: console.info, colorize: brightCyan };
export const NOTICE: LogSeverity = { name: "NOTICE", level: 4, display: console.info, colorize: brightCyan };
export const WARN: LogSeverity = { name: "WARN", level: 5, display: console.warn, colorize: brightYellow };
export const ERROR: LogSeverity = { name: "ERROR", level: 6, display: console.error, colorize: brightRed };
export const FATAL: LogSeverity = { name: "FATAL", level: 7, display: console.error, colorize: brightRed };

export const severities: LogSeverity[] = [SILLY, DEBUG, INFO, NOTICE, WARN, ERROR, FATAL];
export const severityMap = new Map<string, LogSeverity>(severities.map((s) => [s.name, s]));

export interface Logger {
  extend(topic: string, params?: LoggerData): Logger;
  silly(message: string, data?: LoggerData): void;
  debug(message: string, data?: LoggerData): void;
  info(message: string, data?: LoggerData): void;
  notice(message: string, data?: LoggerData): void;
  warn(message: string, data?: LoggerData): void;
  error(message: string, data?: LoggerData): void;
  fatal(message: string, data?: LoggerData): void;
}

export interface Log {
  data: LoggerData;
  date: Date;
  message: string;
  severity: LogSeverity;
  topic: string;
}

export interface LogFilter {
  filter(log: Log): boolean;
}

export interface LogFormatter {
  format(log: Log): string;
}

export type LogChannel = Channel<[Log]>;

export type LogSubscriber = Subscriber<[Log]>;

export function provideLogger(): Logger {
  throw new Breaker("logger-must-be-injected");
}

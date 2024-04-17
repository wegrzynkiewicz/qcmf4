import { ServiceResolver } from "../dependency/service-resolver.ts";
import { BasicLogger } from "./basic-logger.ts";
import { LogChannel, Logger, LoggerData } from "./defs.ts";
import { provideMainLogChannel } from "./log-channel.ts";
import { nullLogger } from "./null-logger.ts";
import { provideLoggingStrategy } from "./logging-strategy-config.ts";

export interface LoggerFactory {
  createLogger(topic: string, params?: LoggerData): Logger;
}

export class BasicLoggerFactory implements LoggerFactory {
  public constructor(
    private readonly channel: LogChannel,
  ) {}

  public createLogger(topic: string, params: LoggerData = {}): Logger {
    return new BasicLogger(this.channel, topic, params);
  }
}

export class NullLoggerFactory implements LoggerFactory {
  public createLogger(): Logger {
    return nullLogger;
  }
}

export function provideLoggerFactory(resolver: ServiceResolver): LoggerFactory {
  const loggingStrategy = resolver.resolve(provideLoggingStrategy);
  if (loggingStrategy === "none") {
    return new NullLoggerFactory();
  }
  return new BasicLoggerFactory(
    resolver.resolve(provideMainLogChannel),
  );
}

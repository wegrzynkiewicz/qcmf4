import { ServiceResolver } from "../dependency/service-resolver.ts";
import { BasicLogger } from "./basic-logger.ts";
import { LogChannel, Logger, LoggerData } from "./defs.ts";
import { provideMainLogChannel } from "./log-channel.ts";

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

export function provideLoggerFactory(resolver: ServiceResolver) {
  return new BasicLoggerFactory(
    resolver.resolve(provideMainLogChannel),
  );
}

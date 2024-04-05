import { BasicLogFilter } from "./basic-log-filter.ts";
import { BasicLogSubscriber } from "./basic-log-subscriber.ts";
import { BrowserLogSubscriber } from "./browser-log-subscriber.ts";
import { Log, LogSeverity } from "./defines.ts";
import { PrettyLogFormatter } from "./pretty-log-formatter.ts";

export interface LogBusSubscriber {
  subscribe(log: Log): void;
}

export interface LogBus {
  dispatch(log: Log): void;
}

export class MainLogBus implements LogBus {
  public readonly subscribers = new Set<LogBusSubscriber>();
  public dispatch(log: Log): void {
    for (const subscriber of this.subscribers) {
      subscriber.subscribe(log);
    }
  }
}

export function provideMainLogBus() {
  const bus = new MainLogBus();
  if (typeof Deno === "object") {
    const subscriber = new BasicLogSubscriber(
      new BasicLogFilter(LogSeverity.SILLY),
      new PrettyLogFormatter(),
    );
    bus.subscribers.add(subscriber);
  } else {
    const subscriber = new BrowserLogSubscriber(
      new BasicLogFilter(LogSeverity.SILLY),
    );
    bus.subscribers.add(subscriber);
  }
  return bus;
}

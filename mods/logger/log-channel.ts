import { Channel } from "../dependency/channel.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { BasicLogFilter } from "./basic-log-filter.ts";
import { BasicLogSubscriber } from "./basic-log-subscriber.ts";
import { BrowserLogSubscriber } from "./browser-log-subscriber.ts";
import { Log, SILLY } from "./defs.ts";
import { provideLoggingStrategy } from "./logging-strategy-config.ts";
import { PrettyLogFormatter } from "./pretty-log-formatter.ts";

export function provideLogChannel(resolver: ServiceResolver) {
  const channel = new Channel<[Log]>();

  const loggingStrategy = resolver.resolve(provideLoggingStrategy);
  switch (loggingStrategy) {
    case "none":
      break;
    case "cli-dev": {
      const subscriber = new BasicLogSubscriber(
        new BasicLogFilter(SILLY),
        new PrettyLogFormatter(),
      );
      channel.subscribers.add(subscriber);
      break;
    }
    case "browser-dev": {
      const subscriber = new BrowserLogSubscriber(
        new BasicLogFilter(SILLY),
      );
      channel.subscribers.add(subscriber);
      break;
    }
  }
  return channel;
}

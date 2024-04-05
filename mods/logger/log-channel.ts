import { Channel } from "../dependency/channel.ts";
import { BasicLogFilter } from "./basic-log-filter.ts";
import { BasicLogSubscriber } from "./basic-log-subscriber.ts";
import { BrowserLogSubscriber } from "./browser-log-subscriber.ts";
import { Log, LogSeverity } from "./defs.ts";
import { PrettyLogFormatter } from "./pretty-log-formatter.ts";

export function provideMainLogChannel() {
  const channel = new Channel<[Log]>();
  if (typeof Deno === "object") {
    const subscriber = new BasicLogSubscriber(
      new BasicLogFilter(LogSeverity.SILLY),
      new PrettyLogFormatter(),
    );
    channel.subscribers.add(subscriber);
  } else {
    const subscriber = new BrowserLogSubscriber(
      new BasicLogFilter(LogSeverity.SILLY),
    );
    channel.subscribers.add(subscriber);
  }
  return channel;
}

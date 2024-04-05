export interface Subscriber<TArgs extends unknown[]> {
  subscribe(...args: TArgs): void;
}

export class Channel<TArgs extends unknown[]> {
  public readonly subscribers = new Set<Subscriber<TArgs>>();

  public on(subscribe: (...args: TArgs) => void) {
    this.subscribers.add({ subscribe });
  }

  public emit(...args: TArgs) {
    for (const subscriber of this.subscribers) {
      subscriber.subscribe(...args);
    }
  }
}

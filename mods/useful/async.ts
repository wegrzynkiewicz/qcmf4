export function withResolvers<T = void>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason: unknown) => void;
} {
  let resolve, reject;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject } as unknown as {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason: unknown) => void;
  };
}

export function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

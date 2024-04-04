export interface BreakerOptions {
  status?: number;
  [index: string]: unknown;
}

export class Breaker extends Error {
  public readonly options: BreakerOptions;
  constructor(message: string, data?: BreakerOptions) {
    const { error, cause, ...others } = data ?? {};
    super(message, { cause: cause ?? error });
    this.name = "Breaker";
    this.options = data ?? {};
    const json = JSON.stringify(others);
    this.stack += `\n    with parameters ${json}.`;
    if (error) {
      this.stack += `\n    cause error:\n${error instanceof Error ? error.stack : error}.`;
    }
  }
}

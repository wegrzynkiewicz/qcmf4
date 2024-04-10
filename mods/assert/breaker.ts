export interface BreakerOptions {
  status?: number;
  [index: string]: unknown;
}

export class Breaker extends Error {
  public readonly options: BreakerOptions;
  public readonly previous: unknown;
  constructor(message: string, data?: BreakerOptions) {
    const { error, ...others } = data ?? {};
    super(message, { cause: error });
    this.name = "Breaker";
    this.options = others ?? {};
    this.previous = error;
  }
}

export function indent(data: string, delimiter: string): string {
  return data
    .split("\n")
    .map((line) => `${delimiter}${line}`)
    .join("\n");
}

export function formatError(e: unknown): string {
  if (e instanceof Error) {
    let msg = e.stack ?? '';
    if (e instanceof Breaker) {
      const json = JSON.stringify(e.options, null, 2);
      msg += `\n    with parameters:\n${indent(json, '      ')}`;
      if (e.previous) {
        msg += `\n    cause error:\n\n`;
        msg += formatError(e.previous);
      }
    }
    return msg;
  } else {
    const msg = JSON.stringify(e);
    return `Unknown error: ${msg}`;
  }
}

export function displayError(error: unknown) {
  console.error(formatError(error));
}


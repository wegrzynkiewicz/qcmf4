import { indent } from "../useful/strings.ts";

export interface BreakerOptions {
  status?: number;
  [index: string]: unknown;
}

export class Breaker extends Error {
  public readonly options: BreakerOptions;
  public readonly previousError: unknown;
  public readonly kind: string;
  public constructor(kind: string, data?: BreakerOptions) {
    const { error, ...others } = data ?? {};
    super(kind, { cause: error });
    this.kind = kind;
    this.name = "Breaker";
    this.options = others ?? {};
    this.previousError = error;
  }
}

export function formatError(e: unknown): string {
  if (e instanceof Error) {
    let msg = e.stack ?? "";
    if (e instanceof Breaker) {
      const json = JSON.stringify(e.options, null, 2);
      msg += `\n    with parameters:\n${indent(json, "      ")}`;
      if (e.previousError) {
        msg += `\n    cause error:\n\n`;
        msg += formatError(e.previousError);
      }
    }
    return msg;
  } else {
    const msg = JSON.stringify(e);
    return `Unknown error: ${msg}`;
  }
}

export function logError(e: unknown) {
  const error = formatError(e);
  const log = {
    data: { error },
    date: new Date(),
    message: 'unexpected-error',
    severity: "ERROR",
    topic: "ERROR",
  }
  const json = JSON.stringify(log);
  console.error(json);
}

export function displayError(error: unknown) {
  console.error(formatError(error));
}

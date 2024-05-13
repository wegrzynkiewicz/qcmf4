import { Breaker } from "./breaker.ts"

export type Data = Record<string, unknown>;

export const isObject = (value: unknown): value is object => typeof value === "object" && value !== null;

export function throws(message: string, data?: Data): never {
  throw new Breaker(message, data);
}

export function assertRequiredString(value: unknown, message: string, data?: Data): asserts value is string {
  if (typeof value !== "string" || value === "") {
    throws(message, data);
  }
}

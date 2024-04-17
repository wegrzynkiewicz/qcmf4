import { isObject } from "../assert/asserts.ts";
import { LayoutResult } from "./flow.ts";

export const layoutTypeValidatorSymbol = Symbol("LayoutTypeValidator");
export interface LayoutTypeValidator<T> {
  [layoutTypeValidatorSymbol](value: T): LayoutResult<T>;
}
export type UnknownLayoutTypeValidator = LayoutTypeValidator<unknown>;
export function isLayoutTypeValidator(value: unknown): value is UnknownLayoutTypeValidator {
  return isObject(value) && layoutTypeValidatorSymbol in value;
}

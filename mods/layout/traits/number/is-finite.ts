import { LayoutTypeValidator, layoutTypeValidatorSymbol } from "../../validation.ts";
import { defineLayoutError, LayoutResult, negativeResult, positiveResult } from "../../flow.ts";

export const invalidFiniteNumberErrorDef = defineLayoutError(
  "invalid-finite-number",
  "Value is not a finite number.",
);

export class IsFiniteNumberValidator implements LayoutTypeValidator<number> {
  public [layoutTypeValidatorSymbol](value: number): LayoutResult<number> {
    if (Number.isFinite(value)) {
      return positiveResult(value);
    }
    return negativeResult(invalidFiniteNumberErrorDef);
  }
}

export function isfinite(): LayoutTypeValidator<number> {
  return new IsFiniteNumberValidator();
}

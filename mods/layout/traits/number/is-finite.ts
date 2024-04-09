import {
  defineLayoutError,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidFiniteNumberErrorDef = defineLayoutError("invalid-finite-number");

export class IsFiniteNumberValidator implements LayoutTypeValidator<number> {
  [layoutTypeValidatorSymbol](value: number): void {
    if (Number.isFinite(value) === false) {
      throw invalidFiniteNumberErrorDef.create();
    }
  }
}

export function isfinite(): LayoutTypeValidator<number> {
  return new IsFiniteNumberValidator();
}

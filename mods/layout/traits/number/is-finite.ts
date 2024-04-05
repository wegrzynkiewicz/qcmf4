import {
  defineLayoutValidationError,
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidFiniteNumberErrorDef = defineLayoutValidationError("invalid-finite-number");

export class IsFiniteNumberValidator implements LayoutTypeValidator<number> {
  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (Number.isFinite(value) === false) {
      context.error(invalidFiniteNumberErrorDef);
    }
  }
}

export function isfinite(): LayoutTypeValidator<number> {
  return new IsFiniteNumberValidator();
}

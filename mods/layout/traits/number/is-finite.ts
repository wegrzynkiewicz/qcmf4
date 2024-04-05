import {
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
  registerLayoutValidationError,
} from "../../defs.ts";

export const invalidFiniteNumberErrorDef = registerLayoutValidationError("invalid-finite-number");

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

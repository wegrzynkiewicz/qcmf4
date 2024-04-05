import {
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
  registerLayoutValidationError,
} from "../../defines.ts";

export const invalidSafeIntegerNumberErrorDef = registerLayoutValidationError("invalid-safe-integer-number");

export class IsIntegerLayoutTypeValidator implements LayoutTypeValidator<number> {
  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (Number.isSafeInteger(value) === false) {
      context.error(invalidSafeIntegerNumberErrorDef);
    }
  }
}

export function isinteger(): LayoutTypeValidator<number> {
  return new IsIntegerLayoutTypeValidator();
}

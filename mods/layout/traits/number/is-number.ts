import {
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
  registerLayoutValidationError,
} from "../../defines.ts";

export const invalidNumberErrorDef = registerLayoutValidationError("invalid-number");

export class IsNumberLayoutTypeValidator implements LayoutTypeValidator<number> {
  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (Number.isNaN(value) === true) {
      context.error(invalidNumberErrorDef);
    }
  }
}

export function isNumber(): LayoutTypeValidator<number> {
  return new IsNumberLayoutTypeValidator();
}

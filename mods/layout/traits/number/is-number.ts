import {
  defineLayoutValidationError,
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidNumberErrorDef = defineLayoutValidationError("invalid-number");

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

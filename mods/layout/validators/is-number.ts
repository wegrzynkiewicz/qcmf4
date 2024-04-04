import { LayoutTypeValidationContext, LayoutTypeValidator, layoutTypeValidatorSymbol, registerLayoutValidationError } from "../defines.ts";

export const notANumberErrorDef = registerLayoutValidationError({
  code: "not-a-number",
  message: "Value is not a number",
});

export class IsNumberLayoutTypeValidator implements LayoutTypeValidator<number> {
  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (Number.isNaN(value) === true) {
      context.error(notANumberErrorDef);
    }
  }
}

export function isNumber(): LayoutTypeValidator<number> {
  return new IsNumberLayoutTypeValidator();
}

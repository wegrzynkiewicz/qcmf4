import { LayoutTypeValidationContext, LayoutTypeValidator, layoutTypeValidatorSymbol, registerLayoutValidationError } from "../defines.ts";

export const notASafeIntegerNumberErrorDef = registerLayoutValidationError({
  code: "not-a-safe-integer-number",
  message: "Value is not a safe integer number",
});

export class IsIntegerLayoutTypeValidator implements LayoutTypeValidator<number> {
  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (Number.isSafeInteger(value) === false) {
      context.error(notASafeIntegerNumberErrorDef);
    }
  }
}

export function isinteger(): LayoutTypeValidator<number> {
  return new IsIntegerLayoutTypeValidator();
}

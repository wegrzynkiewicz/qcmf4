import { LayoutTypeValidationContext, LayoutTypeValidator, layoutTypeValidatorSymbol, registerLayoutValidationError } from "../defines.ts";

export const notAFiniteNumberErrorDef = registerLayoutValidationError({
  code: "not-a-finite-number",
  message: "Value is not a finite number",
});

export class IsFiniteNumberValidator implements LayoutTypeValidator<number> {
  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (Number.isFinite(value) === false) {
      context.error(notAFiniteNumberErrorDef);
    }
  }
}

export function isfinite(): LayoutTypeValidator<number> {
  return new IsFiniteNumberValidator();
}

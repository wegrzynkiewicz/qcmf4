import {
  defineLayoutError,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidSafeIntegerNumberErrorDef = defineLayoutError("invalid-safe-integer-number");

export class IsIntegerLayoutTypeValidator implements LayoutTypeValidator<number> {
  [layoutTypeValidatorSymbol](value: number): void {
    if (Number.isSafeInteger(value) === false) {
      throw invalidSafeIntegerNumberErrorDef.create();
    }
  }
}

export function isinteger(): LayoutTypeValidator<number> {
  return new IsIntegerLayoutTypeValidator();
}

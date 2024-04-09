import {
  defineLayoutError,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidNumberErrorDef = defineLayoutError("invalid-number");

export class IsNumberLayoutTypeValidator implements LayoutTypeValidator<number> {
  [layoutTypeValidatorSymbol](value: number): void {
    if (Number.isNaN(value) === true) {
      throw invalidNumberErrorDef.create();
    }
  }
}

export function isNumber(): LayoutTypeValidator<number> {
  return new IsNumberLayoutTypeValidator();
}

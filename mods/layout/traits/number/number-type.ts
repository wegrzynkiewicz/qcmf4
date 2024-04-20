import { WithValidatorsLayoutType } from "../with-validators.ts";
import { LayoutTrait } from "../../defs.ts";
import { JSONSchema } from "../../json-schema-types.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { LayoutTypeValidator } from "../../parsing.ts";

export const invalidNumberErrorDef = defineLayoutError(
  "invalid-number",
  "Value is not a number (NaN).",
);
export const invalidNumberTypeErrorDef = defineLayoutError(
  "invalid-number-type",
  "Value is not a number type.",
);

export class NumberLayoutType extends WithValidatorsLayoutType<number> {
  public parse(value: unknown): LayoutResult<number> {
    if (typeof value !== "number") {
      return new SingleNegativeLayoutResult(invalidNumberTypeErrorDef);
    }
    if (Number.isNaN(value)) {
      return new SingleNegativeLayoutResult(invalidNumberErrorDef);
    }
    return new PositiveLayoutResult(value);
  }

  public generatePrimaryTypeSchema(): JSONSchema {
    return { type: "number" };
  }
}

export const number = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new NumberLayoutType(validators);
};

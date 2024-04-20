import { LayoutTrait } from "../../defs.ts";
import { LayoutTypeValidator } from "../../parsing.ts";
import { JSONSchema } from "../../json-schema-types.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { invalidNumberTypeErrorDef } from "./number-type.ts";
import { WithValidatorsLayoutType } from "../with-validators.ts";

export const invalidIntegerErrorDef = defineLayoutError(
  "invalid-integer",
  "Value is not an integer.",
);

export class IntegerLayoutType extends WithValidatorsLayoutType<number> {
  public parse(value: unknown): LayoutResult<number> {
    if (typeof value !== "number") {
      return new SingleNegativeLayoutResult(invalidNumberTypeErrorDef);
    }
    if (Number.isInteger(value) === false) {
      return new SingleNegativeLayoutResult(invalidIntegerErrorDef);
    }
    return new PositiveLayoutResult(value);
  }

  public generatePrimaryTypeSchema(): JSONSchema {
    return { type: "integer" };
  }
}

export const integer = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new IntegerLayoutType(validators);
};

import { LayoutTrait } from "../../defs.ts";
import { defineLayoutError, LayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { JSONSchema } from "../../json-schema-types.ts";
import { LayoutTypeValidator } from "../../parsing.ts";
import { WithValidatorsLayoutType } from "../with-validators.ts";

export const invalidStringErrorDef = defineLayoutError(
  "invalid-string",
  "Value is not a string.",
);

export class StringLayoutType extends WithValidatorsLayoutType<string> {
  public parse(value: unknown): LayoutResult<string> {
    if (typeof value !== "string") {
      return new SingleNegativeLayoutResult(invalidStringErrorDef);
    }
    return this.validate(value);
  }

  public generatePrimaryTypeSchema(): JSONSchema {
    return { type: "string" };
  }
}

export const string = (...validators: LayoutTypeValidator<string>[]): LayoutTrait<string> => {
  return new StringLayoutType(validators);
};

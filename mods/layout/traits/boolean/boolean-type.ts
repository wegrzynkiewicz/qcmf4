import { LayoutTrait } from "../../defs.ts";
import { JSONSchema } from "../../json-schema-types.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { WithoutValidatorsLayoutType } from "../without-validation.ts";

export const invalidBooleanErrorDef = defineLayoutError(
  "invalid-boolean",
  "Value is not a boolean.",
);

export class BooleanLayoutType extends WithoutValidatorsLayoutType<boolean> {
  public parse(value: unknown): LayoutResult<boolean> {
    if (typeof value !== "boolean") {
      return new SingleNegativeLayoutResult(invalidBooleanErrorDef);
    }
    return new PositiveLayoutResult(value);
  }

  public generateSchema(): JSONSchema {
    return { type: "boolean" };
  }
}

export const boolean = (): LayoutTrait<boolean> => {
  return new BooleanLayoutType();
};

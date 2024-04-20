import { LayoutTrait } from "../../defs.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { JSONSchema } from "../../json-schema-types.ts";
import { invalidBooleanErrorDef } from "./boolean-type.ts";
import { WithoutValidatorsLayoutType } from "../without-validation.ts";

const map = new Map<string | number | boolean | null, boolean>([
  [true, true],
  [false, false],
  ["true", true],
  ["false", false],
  ["TRUE", true],
  ["FALSE", false],
  ["1", true],
  ["0", false],
  [1, true],
  [0, false],
  ["on", true],
  ["off", false],
  ["ON", true],
  ["OFF", false],
  ["yes", true],
  ["no", false],
  ["YES", true],
  ["NO", false],
  ["y", true],
  ["n", false],
  ["Y", true],
  ["N", false],
  ["nil", false],
  ["null", false],
  [null, false],
  ["undefined", false],
  ["[]", false],
  ["", false],
]);

const keys = [...map.keys()];

export const invalidLogicalErrorDef = defineLayoutError(
  "invalid-logical",
  "Value does not meet any of boolean criteria.",
);

export class LogicalLayoutType extends WithoutValidatorsLayoutType<boolean> {
  public parse(value: unknown): LayoutResult<boolean> {
    for (const [possibleValue, booleanValue] of map.entries()) {
      if (possibleValue === value) {
        return new PositiveLayoutResult(booleanValue);
      }
    }
    return new SingleNegativeLayoutResult(invalidBooleanErrorDef);
  }

  public generateSchema(): JSONSchema {
    return {
      enum: keys,
    };
  }
}

export const logical = (): LayoutTrait<boolean> => {
  return new LogicalLayoutType();
};

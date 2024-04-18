import { AbstractLayoutType, layoutPrimarySchemaGeneratorSymbol } from "../abstract-type.ts";
import { LayoutTrait } from "../../defs.ts";
import { LayoutTypeValidator } from "../../validation.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { layoutTypeParserSymbol } from "../../parsing.ts";
import { invalidNumberTypeErrorDef } from "./number-type.ts";

export const invalidIntegerErrorDef = defineLayoutError(
  "invalid-integer",
  "Value is not an integer.",
);

export class IntegerLayoutType extends AbstractLayoutType<number> {
  public [layoutTypeParserSymbol](value: unknown): LayoutResult<number> {
    if (typeof value !== "number") {
      return new SingleNegativeLayoutResult(invalidNumberTypeErrorDef);
    }
    if (Number.isInteger(value) === false) {
      return new SingleNegativeLayoutResult(invalidIntegerErrorDef);
    }
    return new PositiveLayoutResult(value);
  }

  public [layoutPrimarySchemaGeneratorSymbol](): JSONSchema {
    return { type: "integer" };
  }
}

export const integer = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new IntegerLayoutType(validators);
};

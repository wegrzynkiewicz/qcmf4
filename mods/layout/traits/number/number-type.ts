import { AbstractLayoutType, layoutPrimarySchemaGeneratorSymbol } from "../abstract-type.ts";
import { LayoutTrait } from "../../defs.ts";
import { LayoutTypeValidator } from "../../validation.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { layoutTypeParserSymbol } from "../../parsing.ts";

export const invalidNumberErrorDef = defineLayoutError(
  "invalid-number",
  "Value is not a number (NaN).",
);
export const invalidNumberTypeErrorDef = defineLayoutError(
  "invalid-number-type",
  "Value is not a number type.",
);

export class NumberLayoutType extends AbstractLayoutType<number> {
  public [layoutTypeParserSymbol](value: unknown): LayoutResult<number> {
    if (typeof value !== "number") {
      return new SingleNegativeLayoutResult(invalidNumberTypeErrorDef);
    }
    if (Number.isNaN(value)) {
      return new SingleNegativeLayoutResult(invalidNumberErrorDef);
    }
    return new PositiveLayoutResult(value);
  }

  public [layoutPrimarySchemaGeneratorSymbol](): JSONSchema {
    return { type: "number" };
  }
}

export const unsafeNumber = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new NumberLayoutType(validators);
};

export const number = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new NumberLayoutType(validators);
};

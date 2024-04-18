import { AbstractLayoutType, layoutPrimarySchemaGeneratorSymbol } from "../abstract-type.ts";
import { LayoutTrait } from "../../defs.ts";
import { LayoutTypeValidator } from "../../validation.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { layoutTypeParserSymbol } from "../../parsing.ts";

export const invalidBooleanErrorDef = defineLayoutError(
  "invalid-boolean",
  "Value is not a boolean.",
);

export class BooleanLayoutType extends AbstractLayoutType<boolean> {
  public [layoutTypeParserSymbol](value: unknown): LayoutResult<boolean> {
    if (typeof value !== "boolean") {
      return new SingleNegativeLayoutResult(invalidBooleanErrorDef);
    }
    return new PositiveLayoutResult(value);
  }

  public [layoutPrimarySchemaGeneratorSymbol](): JSONSchema {
    return { type: "boolean" };
  }
}

export const boolean = (...validators: LayoutTypeValidator<boolean>[]): LayoutTrait<boolean> => {
  return new BooleanLayoutType(validators);
};

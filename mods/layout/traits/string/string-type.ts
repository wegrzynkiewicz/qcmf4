import { LayoutTrait } from "../../defs.ts";
import { defineLayoutError, LayoutResult, negativeResult } from "../../flow.ts";
import { layoutTypeParserSymbol } from "../../parsing.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { LayoutTypeValidator } from "../../validation.ts";
import { AbstractLayoutType, layoutPrimarySchemaGeneratorSymbol } from "../abstract-type.ts";

export const invalidStringErrorDef = defineLayoutError("invalid-string");

export class StringLayoutType extends AbstractLayoutType<string> {
  public [layoutTypeParserSymbol](value: unknown): LayoutResult<string> {
    if (typeof value !== "string") {
      return negativeResult(invalidStringErrorDef);
    }
    return this.validate(value);
  }

  public [layoutPrimarySchemaGeneratorSymbol](): JSONSchema {
    return { type: "string" };
  }
}

export const string = (...validators: LayoutTypeValidator<string>[]): LayoutTrait<string> => {
  return new StringLayoutType(validators);
};

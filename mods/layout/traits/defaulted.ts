import { layoutOptionalSymbol, LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { defineLayoutError, PositiveLayoutResult } from "../flow.ts";
import { LayoutResult, SingleNegativeLayoutResult } from "../flow.ts";
import { layoutTypeParserSymbol } from "../parsing.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema, JSONSchemaType } from "../schema/json-schema-types.ts";

export const invalidDefaultedErrorDef = defineLayoutError(
  "invalid-defaulted",
  "The default value cannot be used because the field must be undefined.",
);

export class DefaultLayoutTrait<T extends JSONSchemaType> implements LayoutSchemaGenerator, LayoutTrait<T> {
  public readonly [layoutTraitSymbol] = 1;
  public readonly [layoutOptionalSymbol] = 1;

  public constructor(
    public factory: () => T,
  ) {}

  public [layoutTypeParserSymbol](value: unknown): LayoutResult<T> {
    if (value === undefined) {
      const defaultedValue = this.factory();
      return new PositiveLayoutResult(defaultedValue);
    }
    return new SingleNegativeLayoutResult(invalidDefaultedErrorDef);
  }

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { ["default"]: this.factory() };
  }
}

export const defaulted = <T extends JSONSchemaType>(factory: () => T): LayoutTrait<T> => {
  return new DefaultLayoutTrait<T>(factory);
};

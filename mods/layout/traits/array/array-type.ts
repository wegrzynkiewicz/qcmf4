import { LayoutTrait, UnknownLayout } from "../../defs.ts";
import { GroupingNegativeLayoutResult, NegativeLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { defineLayoutError, LayoutResult } from "../../flow.ts";
import { InferLayout } from "../../mod.ts";
import { LayoutParserContext, layoutTypeParserSymbol } from "../../parsing.ts";
import { LayoutSchemaGeneratorContext } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { LayoutTypeValidator } from "../../validation.ts";
import { AbstractLayoutType, layoutPrimarySchemaGeneratorSymbol } from "../abstract-type.ts";

export const invalidArrayErrorDef = defineLayoutError(
  "invalid-array",
  "Value is not a valid array.",
);

export const invalidArrayItemErrorDef = defineLayoutError(
  "invalid-array-item",
  "Some elements in the array are invalid",
);

export const invalidArrayItemIndexErrorDef = defineLayoutError(
  "invalid-array-item-index",
  "Element at index [{{index}}] is invalid",
);

class ArrayLayoutType<T extends UnknownLayout> extends AbstractLayoutType<unknown[]> {
  public constructor(
    public itemsLayout: T,
    validators: LayoutTypeValidator<unknown[]>[],
  ) {
    super(validators);
  }

  public [layoutTypeParserSymbol](value: unknown, context: LayoutParserContext): LayoutResult<T[]> {
    if (Array.isArray(value) === false) {
      return new SingleNegativeLayoutResult(invalidArrayErrorDef);
    }
    const { parser } = context;
    const list: T[] = [];
    const tries: NegativeLayoutResult[] = [];
    for (const [index, item] of value.entries()) {
      const result = parser.parse(item, this.itemsLayout);
      if (SingleNegativeLayoutResult.is(result)) {
        const indexResult = new SingleNegativeLayoutResult(invalidArrayItemIndexErrorDef, { index, result });
        tries.push(indexResult);
        continue;
      }
      list[index] = result.value;
    }
    const count = tries.length;
    if (count === 0) {
      return this.validate(list);
    }
    if (count === 1) {
      return tries[0];
    }
    return new GroupingNegativeLayoutResult(invalidArrayItemErrorDef, tries);
  }

  public [layoutPrimarySchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): JSONSchema {
    const { schemaCreator } = context;
    const targetSchema: JSONSchema = {
      items: schemaCreator.create(this.itemsLayout),
      type: "array",
    };
    return targetSchema;
  }
}

export const array = <TLayout extends UnknownLayout>(
  itemsLayout: TLayout,
  ...validators: LayoutTypeValidator<unknown[]>[]
): LayoutTrait<InferLayout<TLayout>[]> => {
  return new ArrayLayoutType<TLayout>(itemsLayout, validators);
};

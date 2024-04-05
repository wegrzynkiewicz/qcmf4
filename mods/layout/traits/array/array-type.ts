import { LayoutTrait, LayoutTypeValidator, UnknownLayout } from "../../defs.ts";
import { InferLayout } from "../../mod.ts";
import { LayoutSchemaGeneratorContext, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { AbstractLayoutType, layoutJSONSchemaTypeSymbol } from "../abstract-type.ts";

class ArrayLayoutType<T> extends AbstractLayoutType<T[]> {
  readonly [layoutJSONSchemaTypeSymbol] = "array";
  constructor(
    public itemsLayout: UnknownLayout,
    validators: LayoutTypeValidator<unknown[]>[],
  ) {
    super(validators);
  }

  [layoutSchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): JSONSchema {
    const { schemaCreator } = context;
    const inheritSchema = super[layoutSchemaGeneratorSymbol](context);
    const targetSchema: JSONSchema = {
      ...inheritSchema,
      items: schemaCreator.create(this.itemsLayout),
    };
    return targetSchema;
  }
}

export const array = <TLayout extends UnknownLayout, TResult = InferLayout<TLayout>>(
  itemsLayout: TLayout,
  ...validators: LayoutTypeValidator<unknown[]>[]
): LayoutTrait<TResult[]> => {
  return new ArrayLayoutType<TResult>(itemsLayout, validators);
};

import { LayoutTrait, LayoutTypeValidator, UnknownLayout } from "../defines.ts";
import { InferLayout } from "../mod.ts";
import { layoutSchemaGeneratorSymbol, LayoutSchemaGeneratorContext } from "../schema/defines.ts";
import { JSONSchema } from "../schema/mod.ts";
import { AbstractLayoutType, layoutJSONSchemaTypeSymbol } from "./abstract-type.ts";

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
}

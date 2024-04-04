import { LayoutTrait, LayoutTypeValidator } from "../defines.ts";
import { layoutSchemaGeneratorSymbol, LayoutSchemaGeneratorContext } from "../schema/defines.ts";
import { JSONSchema } from "../schema/mod.ts";
import { AbstractLayoutType, layoutJSONSchemaTypeSymbol } from "./abstract-type.ts";

export class DateLayoutType extends AbstractLayoutType<Date> {
  readonly [layoutJSONSchemaTypeSymbol] = "string";
  [layoutSchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): JSONSchema {
    const inheritSchema = super[layoutSchemaGeneratorSymbol](context);
    const targetSchema: JSONSchema = {
      ...inheritSchema,
      format: "date-time",
    }
    return targetSchema;
  }
}

export const date = (
  ...validators: LayoutTypeValidator<Date>[]
): LayoutTrait<Date> => {
  return new DateLayoutType(validators);
}

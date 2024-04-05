import { LayoutTrait, layoutTraitSymbol, LayoutTypeValidator } from "../defs.ts";
import { LayoutSchemaGenerator, LayoutSchemaGeneratorContext, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchemaTypeName, JSONSchema } from "../schema/json-schema-types.ts";

export const layoutJSONSchemaTypeSymbol = Symbol("LayoutJSONSchemaType");

export abstract class AbstractLayoutType<T> implements LayoutSchemaGenerator, LayoutTrait<T> {
  abstract readonly [layoutJSONSchemaTypeSymbol]: JSONSchemaTypeName;
  readonly [layoutTraitSymbol] = 1;
  constructor(
    public validators: LayoutTypeValidator<T>[],
  ) {}

  [layoutSchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): JSONSchema {
    const { schemaCreator } = context;
    const schemas = this.validators.map((validator) => {
      return schemaCreator.generateSchema(validator);
    });
    const targetSchema = {
      type: this[layoutJSONSchemaTypeSymbol],
    };
    const resultSchema = Object.assign(targetSchema, ...schemas);
    return resultSchema;
  }
}

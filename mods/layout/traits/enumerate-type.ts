import { UnknownLayoutArray } from "../defs.ts";
import { layoutTraitSymbol } from "../defs.ts";
import { InferEnumerate } from "../defs.ts";
import { LayoutTrait } from "../defs.ts";
import { LayoutSchemaGenerator, LayoutSchemaGeneratorContext, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";

export class EnumerateLayoutType<T extends UnknownLayoutArray> implements LayoutSchemaGenerator, LayoutTrait<T> {
  readonly [layoutTraitSymbol] = 1;

  public constructor(
    public readonly members: T,
  ) {}

  [layoutSchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): JSONSchema {
    const { schemaCreator } = context;
    const oneOf = this.members.map((layout) => {
      const schema = schemaCreator.create(layout);
      return schema;
    });
    const targetSchema: JSONSchema = { oneOf };
    return targetSchema;
  }
}

export const enumerate = <T extends UnknownLayoutArray>(...members: T): LayoutTrait<InferEnumerate<T>> => {
  return new EnumerateLayoutType(members);
};

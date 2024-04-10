import { UnknownLayoutArray } from "../defs.ts";
import { layoutTraitSymbol } from "../defs.ts";
import { InferEnumerate } from "../defs.ts";
import { LayoutTrait } from "../defs.ts";
import { LayoutTypeParser, layoutTypeParserSymbol, LayoutParserContext } from "../parsing/defs.ts";
import { LayoutSchemaGenerator, LayoutSchemaGeneratorContext, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";
import { LayoutError, defineLayoutError } from "../validation/defs.ts";

export const invalidEnumerateErrorDef = defineLayoutError("invalid-enumerate");

export class EnumerateLayoutType<T extends UnknownLayoutArray>
  implements LayoutSchemaGenerator, LayoutTypeParser<T>, LayoutTrait<T> {
  readonly [layoutTraitSymbol] = 1;

  public constructor(
    public readonly members: T,
  ) { }

  [layoutTypeParserSymbol](value: unknown, context: LayoutParserContext): T {
    const { parser } = context;
    const enumFields: unknown[] = [];
    for (const member of this.members) {
      try {
        const parsedValue = parser.parse(value, member);
        return parsedValue;
      } catch (error) {
        if (error instanceof LayoutError) {
          enumFields.push(error);
        } else {
          throw error;
        }
      }
    }
    throw invalidEnumerateErrorDef.create({ enumFields });
  }

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

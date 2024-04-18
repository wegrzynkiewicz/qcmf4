import { Breaker } from "../../assert/breaker.ts";
import { UnknownLayoutArray } from "../defs.ts";
import { layoutTraitSymbol } from "../defs.ts";
import { InferEnumerate } from "../defs.ts";
import { LayoutTrait } from "../defs.ts";
import { GroupingNegativeLayoutResult, NegativeLayoutResult, PositiveLayoutResult } from "../flow.ts";
import { defineLayoutError, LayoutResult } from "../flow.ts";
import { LayoutParserContext, LayoutTypeParser, layoutTypeParserSymbol } from "../parsing.ts";
import { LayoutSchemaGenerator, LayoutSchemaGeneratorContext, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";

export const invalidEnumerateErrorDef = defineLayoutError(
  "invalid-enumerate",
  "Value does not match any of the enumerated options",
);

export class EnumerateLayoutType<T extends UnknownLayoutArray>
  implements LayoutSchemaGenerator, LayoutTypeParser<T>, LayoutTrait<T> {
  public readonly [layoutTraitSymbol] = 1;

  public constructor(
    public readonly members: T,
  ) {}

  public [layoutTypeParserSymbol](value: unknown, context: LayoutParserContext): LayoutResult<T> {
    const { parser } = context;
    const tries: NegativeLayoutResult[] = [];
    for (const member of this.members) {
      try {
        const result = parser.parse(value, member);
        if (PositiveLayoutResult.is(result) === true) {
          return result;
        }
        tries.push(result);
      } catch (error) {
        throw new Breaker("error-inside-enumerate-layout-parsing", { error, member });
      }
    }
    return new GroupingNegativeLayoutResult(invalidEnumerateErrorDef, tries);
  }

  public [layoutSchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): JSONSchema {
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

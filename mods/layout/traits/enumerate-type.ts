import { Breaker } from "../../assert/breaker.ts";
import { InferEnumerate, LayoutTrait, UnknownLayoutArray } from "../defs.ts";
import {
  defineLayoutError,
  GroupingNegativeLayoutResult,
  LayoutResult,
  NegativeLayoutResult,
  PositiveLayoutResult,
} from "../flow.ts";
import { JSONSchema } from "../json-schema-types.ts";
import { LayoutParserContext } from "../parsing.ts";
import { LayoutSchemaGeneratorContext } from "../schema.ts";
import { WithoutValidatorsLayoutType } from "./without-validation.ts";

export const invalidEnumerateErrorDef = defineLayoutError(
  "invalid-enumerate",
  "Value does not match any of the enumerated options",
);

export class EnumerateLayoutType<T extends UnknownLayoutArray> extends WithoutValidatorsLayoutType<T> {
  public constructor(
    public readonly members: T,
  ) {
    super();
  }

  public parse(value: unknown, context: LayoutParserContext): LayoutResult<T> {
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

  public generateSchema(context: LayoutSchemaGeneratorContext): JSONSchema {
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

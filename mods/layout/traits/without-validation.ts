import { LayoutTrait, UnknownLayout } from "../defs.ts";
import { LayoutResult } from "../flow.ts";
import { LayoutParserContext, LayoutTypeParser } from "../parsing.ts";
import { LayoutSchemaGenerator, LayoutSchemaGeneratorContext } from "../schema.ts";
import { JSONSchema } from "../json-schema-types.ts";

export abstract class WithoutValidatorsLayoutType<T>
  implements LayoutSchemaGenerator, LayoutTypeParser<T>, LayoutTrait<T> {
  public abstract generateSchema(context: LayoutSchemaGeneratorContext): JSONSchema;
  public abstract parse(value: unknown, context: LayoutParserContext): LayoutResult<T>;

  public init(layout: UnknownLayout): void {
    layout.parsers.push(this);
    layout.schemaGenerators.push(this);
  }
}

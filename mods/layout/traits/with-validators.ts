import { LayoutTrait, UnknownLayout } from "../defs.ts";
import {
  defineLayoutError,
  GroupingNegativeLayoutResult,
  LayoutResult,
  NegativeLayoutResult,
  PositiveLayoutResult,
  SingleNegativeLayoutResult,
} from "../flow.ts";
import { LayoutParserContext, LayoutTypeParser, LayoutTypeValidator } from "../parsing.ts";
import { LayoutSchemaGenerator, LayoutSchemaGeneratorContext } from "../schema.ts";
import { JSONSchema } from "../json-schema-types.ts";

export const invalidValidationErrorDef = defineLayoutError(
  "invalid-validation",
  "Value does not conform to the following constraints",
);

export abstract class WithValidatorsLayoutType<T>
  implements LayoutSchemaGenerator, LayoutTypeParser<T>, LayoutTrait<T> {
  public constructor(
    public validators: LayoutTypeValidator<T>[],
  ) {}

  public abstract generatePrimaryTypeSchema(context: LayoutSchemaGeneratorContext): JSONSchema;
  public abstract parse(value: unknown, context: LayoutParserContext): LayoutResult<T>;

  public validate(value: T): LayoutResult<T> {
    const tries: NegativeLayoutResult[] = [];
    for (const validator of this.validators) {
      const result = validator.validate(value);
      if (SingleNegativeLayoutResult.is(result)) {
        tries.push(result);
      }
    }
    const count = tries.length;
    if (count === 0) {
      return new PositiveLayoutResult(value);
    }
    if (count === 1) {
      return tries[0];
    }
    return new GroupingNegativeLayoutResult(invalidValidationErrorDef, tries);
  }

  public generateSchema(context: LayoutSchemaGeneratorContext): JSONSchema {
    const { schemaCreator } = context;
    const schemas = this.validators.map((validator) => {
      return schemaCreator.generateSchema(validator);
    });
    const targetSchema = this.generatePrimaryTypeSchema(context);
    const resultSchema = Object.assign(targetSchema, ...schemas);
    return resultSchema;
  }

  public init(layout: UnknownLayout): void {
    layout.parsers.push(this);
    layout.schemaGenerators.push(this);
  }
}

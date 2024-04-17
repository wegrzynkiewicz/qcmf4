import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import {
  defineLayoutError,
  isNegativeResult,
  LayoutResult,
  NegativeLayoutResult,
  negativeResult,
  positiveResult,
} from "../flow.ts";
import { LayoutParserContext, LayoutTypeParser, layoutTypeParserSymbol } from "../parsing.ts";
import { LayoutSchemaGenerator, LayoutSchemaGeneratorContext, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";
import { LayoutTypeValidator, layoutTypeValidatorSymbol } from "../validation.ts";

export const layoutPrimarySchemaGeneratorSymbol = Symbol("LayoutGenerateSchemaType");

export const invalidValidationErrorDef = defineLayoutError(
  "invalid-validation",
  "The value does not conform to the following constraints:",
);

export abstract class AbstractLayoutType<T> implements LayoutSchemaGenerator, LayoutTypeParser<T>, LayoutTrait<T> {
  public readonly [layoutTraitSymbol] = 1;

  public constructor(
    public validators: LayoutTypeValidator<T>[],
  ) {}

  public abstract [layoutPrimarySchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): JSONSchema;
  public abstract [layoutTypeParserSymbol](value: unknown, context: LayoutParserContext): LayoutResult<T>;

  public validate(value: T): LayoutResult<T> {
    const tries: NegativeLayoutResult[] = [];
    for (const validator of this.validators) {
      const result = validator[layoutTypeValidatorSymbol](value);
      if (isNegativeResult(result)) {
        tries.push(result);
      }
    }
    const count = tries.length;
    if (count === 0) {
      return positiveResult(value);
    }
    if (count === 1) {
      return tries[0];
    }
    return negativeResult(invalidValidationErrorDef, { tries });
  }

  public [layoutSchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): JSONSchema {
    const { schemaCreator } = context;
    const schemas = this.validators.map((validator) => {
      return schemaCreator.generateSchema(validator);
    });
    const targetSchema = this[layoutPrimarySchemaGeneratorSymbol](context);
    const resultSchema = Object.assign(targetSchema, ...schemas);
    return resultSchema;
  }
}

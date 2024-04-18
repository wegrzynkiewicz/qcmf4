import { Breaker } from "../../../assert/breaker.ts";
import { InferLayoutObject, LayoutTrait, UnknownLayoutMap, UnknownLayoutTrait } from "../../defs.ts";
import { GroupingNegativeLayoutResult, PositiveLayoutResult } from "../../flow.ts";
import { defineLayoutError, LayoutResult, NegativeLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { LayoutParserContext, layoutTypeParserSymbol } from "../../parsing.ts";
import { LayoutSchemaGeneratorContext } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { LayoutTypeValidator } from "../../validation.ts";
import { AbstractLayoutType, layoutPrimarySchemaGeneratorSymbol } from "../abstract-type.ts";
import { isOptionalLayoutType } from "./optional.ts";

export function isRequiredField(traits: UnknownLayoutTrait[]): boolean {
  for (const trait of traits) {
    if (isOptionalLayoutType(trait)) {
      return false;
    }
  }
  return true;
}

export const invalidObjectErrorDef = defineLayoutError(
  "invalid-object",
  "Value is not an object.",
);

export const nullObjectErrorDef = defineLayoutError(
  "null-object",
  "Value is not an object. Null value passed.",
);

export const invalidObjectFieldsErrorDef = defineLayoutError(
  "invalid-object-fields",
  "Object is invalid and contains errors",
);

export const invalidObjectFieldErrorDef = defineLayoutError(
  "invalid-object-field",
  "Field named ({{field}}) is invalid and contains errors",
);

export const missingObjectFieldErrorDef = defineLayoutError(
  "missing-object-field",
  "Missing required field named ({{field}}).",
);

export class LayoutObjectTrait<T extends UnknownLayoutMap> extends AbstractLayoutType<InferLayoutObject<T>> {
  protected requiredFields = new Map<string, boolean>();

  public constructor(
    public fields: T,
    validators: LayoutTypeValidator<InferLayoutObject<T>>[] = [],
  ) {
    super(validators);
    for (const [fieldName, layout] of Object.entries(fields)) {
      this.requiredFields.set(fieldName, isRequiredField(layout.traits));
    }
  }

  public [layoutTypeParserSymbol](value: unknown, context: LayoutParserContext): LayoutResult<InferLayoutObject<T>> {
    const { parser } = context;
    if (typeof value !== "object") {
      return new SingleNegativeLayoutResult(invalidObjectErrorDef);
    }
    if (value === null) {
      return new SingleNegativeLayoutResult(nullObjectErrorDef);
    }
    const obj: Partial<T> = value;
    const tries: NegativeLayoutResult[] = [];
    const entries: [string, unknown][] = [];
    for (const [field, layout] of Object.entries(this.fields)) {
      if (field in obj === false) {
        const isRequired = this.requiredFields.get(field);
        if (isRequired) {
          const result = new SingleNegativeLayoutResult(missingObjectFieldErrorDef, { field });
          tries.push(result);
          continue;
        }
      }
      const value = obj[field];
      try {
        const result = parser.parse(value, layout);
        if (SingleNegativeLayoutResult.is(result) === true) {
          const fieldResult = new GroupingNegativeLayoutResult(invalidObjectFieldErrorDef, [result], { field });
          tries.push(fieldResult);
          continue;
        }
        entries.push([field, result.value]);
      } catch (error) {
        throw new Breaker("error-inside-object-field-layout-parsing", { error, field, layout });
      }
    }
    const count = tries.length;
    if (count === 0) {
      const targetObject = Object.fromEntries(entries) as InferLayoutObject<T>;
      return new PositiveLayoutResult(targetObject);
    }
    if (count === 1) {
      return tries[0];
    }
    return new GroupingNegativeLayoutResult(invalidObjectFieldsErrorDef, tries);
  }

  public [layoutPrimarySchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): JSONSchema {
    const { schemaCreator } = context;
    const required: string[] = [];
    const properties = Object.entries(this.fields).map(([fieldName, layout]) => {
      if (this.requiredFields.get(fieldName)) {
        required.push(fieldName);
      }
      const schema = schemaCreator.create(layout);
      return [fieldName, schema];
    });
    return {
      type: "object",
      properties: Object.fromEntries(properties),
      required,
    };
  }
}

export const object = <T extends UnknownLayoutMap>(
  fields: T,
  ...validators: LayoutTypeValidator<InferLayoutObject<T>>[]
): LayoutTrait<InferLayoutObject<T>> => {
  return new LayoutObjectTrait(fields, validators);
};

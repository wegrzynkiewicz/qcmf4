import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { LayoutTypeValidator, layoutTypeValidatorSymbol } from "../../validation.ts";
import { defineLayoutError, LayoutResult, negativeResult, positiveResult } from "../../flow.ts";

export const invalidMinArrayItemsErrorDef = defineLayoutError(
  "invalid-min-array-items",
  "Array does not meet minimum item limit. Expected '{{threshold}}' or more.",
);

export class MinArrayItemsLayoutTypeValidator implements LayoutSchemaGenerator, LayoutTypeValidator<unknown[]> {
  public constructor(
    private threshold: number,
  ) {}

  public [layoutTypeValidatorSymbol](value: unknown[]): LayoutResult<unknown[]> {
    const { threshold } = this;
    if (value.length < threshold) {
      return negativeResult(invalidMinArrayItemsErrorDef, { value, threshold });
    }
    return positiveResult(value);
  }

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { minItems: this.threshold };
  }
}

export function minItems(threshold: number): MinArrayItemsLayoutTypeValidator {
  return new MinArrayItemsLayoutTypeValidator(threshold);
}

import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { LayoutTypeValidator, layoutTypeValidatorSymbol } from "../../validation.ts";
import { defineLayoutError, negativeResult, positiveResult } from "../../flow.ts";
import { LayoutResult } from "../../mod.ts";

export const invalidMaxArrayItemsErrorDef = defineLayoutError(
  "invalid-max-array-items",
  "Array exceeds maximum item limit. Expected '{{threshold}}' or less.",
);

export class MaxArrayItemsLayoutTypeValidator implements LayoutSchemaGenerator, LayoutTypeValidator<unknown[]> {
  public constructor(
    private threshold: number,
  ) {}

  public [layoutTypeValidatorSymbol](value: unknown[]): LayoutResult<unknown[]> {
    const { threshold } = this;
    if (value.length > threshold) {
      return negativeResult(invalidMaxArrayItemsErrorDef, { value, threshold });
    }
    return positiveResult(value);
  }

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { maxItems: this.threshold };
  }
}

export function maxItems(threshold: number): MaxArrayItemsLayoutTypeValidator {
  return new MaxArrayItemsLayoutTypeValidator(threshold);
}

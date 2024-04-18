import { JSONSchema } from "../../schema/json-schema-types.ts";
import { LayoutTypeValidator, layoutTypeValidatorSymbol } from "../../validation.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";

export const invalidMaxStringLengthErrorDef = defineLayoutError(
  "invalid-max-string-length",
  "Value exceeds maximum length limit. Expected ({{threshold}}) or less.",
);

export class MaxStringLengthLayoutTypeValidator implements LayoutSchemaGenerator, LayoutTypeValidator<string> {
  public constructor(
    private threshold: number,
  ) {}

  public [layoutTypeValidatorSymbol](value: string): LayoutResult<string> {
    const { threshold } = this;
    if (value.length > threshold) {
      return new SingleNegativeLayoutResult(invalidMaxStringLengthErrorDef, { value, threshold });
    }
    return new PositiveLayoutResult(value);
  }

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { maxLength: this.threshold };
  }
}

export function maxLength(threshold: number): MaxStringLengthLayoutTypeValidator {
  return new MaxStringLengthLayoutTypeValidator(threshold);
}

import { JSONSchema } from "../../schema/json-schema-types.ts";
import { LayoutTypeValidator, layoutTypeValidatorSymbol } from "../../validation.ts";
import { defineLayoutError, LayoutResult } from "../../flow.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { SingleNegativeLayoutResult } from "../../flow.ts";
import { PositiveLayoutResult } from "../../flow.ts";

export const invalidMinStringLengthErrorDef = defineLayoutError(
  "invalid-min-string-length",
  "Value does not meet minimum length limit. Expected ({{threshold}}) or more.",
);

export class MinStringLengthLayoutTypeValidator implements LayoutSchemaGenerator, LayoutTypeValidator<string> {
  public constructor(
    private threshold: number,
  ) {}

  public [layoutTypeValidatorSymbol](value: string): LayoutResult<string> {
    const { threshold } = this;
    if (value.length < threshold) {
      return new SingleNegativeLayoutResult(invalidMinStringLengthErrorDef, { value, threshold });
    }
    return new PositiveLayoutResult(value);
  }

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { minLength: this.threshold };
  }
}

export function minLength(threshold: number): MinStringLengthLayoutTypeValidator {
  return new MinStringLengthLayoutTypeValidator(threshold);
}

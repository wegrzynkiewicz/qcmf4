import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { LayoutTypeValidator, layoutTypeValidatorSymbol } from "../../validation.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";

export const invalidLessThanErrorDef = defineLayoutError(
  "invalid-less-than",
  "Value is not less than ({{expected}}).",
);

export class LessThanLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  public constructor(
    private threshold: number,
  ) {}

  public [layoutTypeValidatorSymbol](value: number): LayoutResult<number> {
    if (value < this.threshold) {
      return new PositiveLayoutResult(value);
    }
    return new SingleNegativeLayoutResult(invalidLessThanErrorDef, { actual: value, expected: this.threshold });
  }

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { maximum: this.threshold };
  }
}

export function lessThan(threshold: number): LessThanLayoutTypeValidator {
  return new LessThanLayoutTypeValidator(threshold);
}

export const invalidLessThanEqualErrorDef = defineLayoutError(
  "invalid-less-than-or-equal",
  "Value is not less than or equal to ({{expected}}).",
);

export class LessThanOrEqualLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  public constructor(
    private threshold: number,
  ) {}

  public [layoutTypeValidatorSymbol](value: number): LayoutResult<number> {
    if (value <= this.threshold) {
      return new PositiveLayoutResult(value);
    }
    return new SingleNegativeLayoutResult(invalidLessThanEqualErrorDef, { actual: value, expected: this.threshold });
  }

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { exclusiveMaximum: this.threshold };
  }
}

export function lessThanOrEqual(threshold: number): LessThanOrEqualLayoutTypeValidator {
  return new LessThanOrEqualLayoutTypeValidator(threshold);
}

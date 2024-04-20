import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { JSONSchema } from "../../json-schema-types.ts";
import { LayoutTypeValidator } from "../../parsing.ts";
import { LayoutSchemaGenerator } from "../../schema.ts";

export const invalidGreaterThan = defineLayoutError(
  "invalid-greater-than",
  "Value is not greater than ({{expected}}).",
);

export class GreaterThanLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  public constructor(
    private threshold: number,
  ) {}

  public validate(value: number): LayoutResult<number> {
    if (value > this.threshold) {
      return new PositiveLayoutResult(value);
    }
    return new SingleNegativeLayoutResult(invalidGreaterThan, { actual: value, expected: this.threshold });
  }

  public generateSchema(): JSONSchema {
    return { exclusiveMinimum: this.threshold };
  }
}

export function greaterThan(threshold: number): GreaterThanLayoutTypeValidator {
  return new GreaterThanLayoutTypeValidator(threshold);
}

export const invalidGreaterThanEqual = defineLayoutError(
  "invalid-number-greater-than-or-equal",
  "Value is not greater than or equal to ({{expected}}).",
);

export class GreaterThanOrEqualLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  public constructor(
    private threshold: number,
  ) {}

  public validate(value: number): LayoutResult<number> {
    if (value >= this.threshold) {
      return new PositiveLayoutResult(value);
    }
    return new SingleNegativeLayoutResult(invalidGreaterThanEqual, { actual: value, expected: this.threshold });
  }

  public generateSchema(): JSONSchema {
    return { minimum: this.threshold };
  }
}

export function greaterThanOrEqual(threshold: number): GreaterThanOrEqualLayoutTypeValidator {
  return new GreaterThanOrEqualLayoutTypeValidator(threshold);
}

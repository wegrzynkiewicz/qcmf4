import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutError,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidGreaterThan = defineLayoutError("invalid-greater-than");

export class GreaterThanLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number): void {
    if (value > this.threshold) {
      return;
    }
    throw invalidGreaterThan.create({
      actual: value,
      expected: this.threshold,
    });
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { exclusiveMinimum: this.threshold };
  }
}

export function greaterThan(threshold: number): GreaterThanLayoutTypeValidator {
  return new GreaterThanLayoutTypeValidator(threshold);
}

export const invalidGreaterThanEqual = defineLayoutError("invalid-number-greater-than-or-equal");

export class GreaterThanOrEqualLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number): void {
    if (value >= this.threshold) {
      return;
    }
    throw invalidGreaterThanEqual.create({
      actual: value,
      expected: this.threshold,
    });
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { minimum: this.threshold };
  }
}

export function greaterThanOrEqual(threshold: number): GreaterThanOrEqualLayoutTypeValidator {
  return new GreaterThanOrEqualLayoutTypeValidator(threshold);
}

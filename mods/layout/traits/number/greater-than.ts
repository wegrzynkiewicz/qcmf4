import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutValidationError,
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidGreaterThan = defineLayoutValidationError("invalid-greater-than");

export class GreaterThanLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (value > this.threshold) {
      return;
    }
    context.error(invalidGreaterThan);
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { exclusiveMinimum: this.threshold };
  }
}

export function greaterThan(threshold: number): GreaterThanLayoutTypeValidator {
  return new GreaterThanLayoutTypeValidator(threshold);
}

export const invalidGreaterThanEqual = defineLayoutValidationError("invalid-number-greater-than-or-equal");

export class GreaterThanOrEqualLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (value >= this.threshold) {
      return;
    }
    context.error(invalidGreaterThanEqual);
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { minimum: this.threshold };
  }
}

export function greaterThanOrEqual(threshold: number): GreaterThanOrEqualLayoutTypeValidator {
  return new GreaterThanOrEqualLayoutTypeValidator(threshold);
}

import {
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
  registerLayoutValidationError,
} from "../../defs.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";

export const invalidGreaterThan = registerLayoutValidationError("invalid-greater-than");

export class GreaterThanLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) { }

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

export const invalidGreaterThanEqual = registerLayoutValidationError("invalid-number-greater-than-or-equal");

export class GreaterThanOrEqualLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) { }

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

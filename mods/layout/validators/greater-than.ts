import {
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
  registerLayoutValidationError,
} from "../defines.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defines.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";

export const notGreaterThan = registerLayoutValidationError(
  "not-greater-than",
  "Value is not greater than the specified number",
);

export class GreaterThanLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (value > this.threshold) {
      return;
    }
    context.error(notGreaterThan);
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { exclusiveMinimum: this.threshold };
  }
}

export function greaterThan(threshold: number): GreaterThanLayoutTypeValidator {
  return new GreaterThanLayoutTypeValidator(threshold);
}

export const notGreaterThanEqual = registerLayoutValidationError(
  "not-greater-than-or-equal",
  "Value is not greater than or equal to the specified number",
);

export class GreaterThanOrEqualLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (value >= this.threshold) {
      return;
    }
    context.error(notGreaterThanEqual);
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { minimum: this.threshold };
  }
}

export function greaterThanOrEqual(threshold: number): GreaterThanOrEqualLayoutTypeValidator {
  return new GreaterThanOrEqualLayoutTypeValidator(threshold);
}

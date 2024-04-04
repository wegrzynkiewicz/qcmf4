import { LayoutTypeValidationContext, LayoutTypeValidator, layoutTypeValidatorSymbol, registerLayoutValidationError } from "../defines.ts";
import { layoutSchemaGeneratorSymbol, LayoutSchemaGenerator } from "../schema/defines.ts";
import { JSONSchema } from "../schema/mod.ts";

export const notGreaterThan = registerLayoutValidationError(
  "not-greater-than",
  "Value is not greater than the specified number",
);

export type ComparisonValidatorType = LayoutTypeValidator<number> & LayoutSchemaGenerator;

export function greaterThan(threshold: number): ComparisonValidatorType {
  return {
    [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
      if (value > threshold) {
        return;
      }
      context.error(notGreaterThan);
    },
    [layoutSchemaGeneratorSymbol](): JSONSchema {
      return { exclusiveMinimum: threshold };
    }
  }
}

export const notGreaterThanEqual = registerLayoutValidationError(
  "not-greater-than-or-equal",
  "Value is not greater than or equal to the specified number",
);

export function greaterThanOrEqual(threshold: number): ComparisonValidatorType {
  return {
    [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
      if (value >= threshold) {
        return;
      }
      context.error(notGreaterThanEqual);
    },
    [layoutSchemaGeneratorSymbol](): JSONSchema {
      return { minimum: threshold };
    }
  }
}

export const notLessThan = registerLayoutValidationError(
  "not-less-than",
  "Value is not less than the specified number",
);

export function lessThan(threshold: number): ComparisonValidatorType {
  return {
    [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
      if (value < threshold) {
        return;
      }
      context.error(notLessThan);
    },
    [layoutSchemaGeneratorSymbol](): JSONSchema {
      return { maximum: threshold };
    }
  }
}

export const notLessThanEqual = registerLayoutValidationError(
  "not-less-than-or-equal",
  "Value is not less than or equal to the specified number",
);

export function lessThanOrEqual(threshold: number): ComparisonValidatorType {
  return {
    [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
      if (value <= threshold) {
        return;
      }
      context.error(notLessThanEqual);
    },
    [layoutSchemaGeneratorSymbol](): JSONSchema {
      return { exclusiveMaximum: threshold };
    }
  }
}

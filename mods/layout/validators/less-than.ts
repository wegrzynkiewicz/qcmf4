import {
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
  registerLayoutValidationError,
} from "../defines.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defines.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";

export const notLessThan = registerLayoutValidationError(
  "not-less-than",
  "Value is not less than the specified number",
);

export class LessThanLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (value < this.threshold) {
      return;
    }
    context.error(notLessThan);
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { maximum: this.threshold };
  }
}

export function lessThan(threshold: number): LessThanLayoutTypeValidator {
  return new LessThanLayoutTypeValidator(threshold);
}

export const notLessThanEqual = registerLayoutValidationError(
  "not-less-than-or-equal",
  "Value is not less than or equal to the specified number",
);

export class LessThanOrEqualLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (value <= this.threshold) {
      return;
    }
    context.error(notLessThanEqual);
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { exclusiveMaximum: this.threshold };
  }
}

export function lessThanOrEqual(threshold: number): LessThanOrEqualLayoutTypeValidator {
  return new LessThanOrEqualLayoutTypeValidator(threshold);
}

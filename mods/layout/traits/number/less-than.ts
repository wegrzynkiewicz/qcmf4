import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutValidationError,
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidLessThanErrorDef = defineLayoutValidationError("not-less-than");

export class LessThanLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (value < this.threshold) {
      return;
    }
    context.error(invalidLessThanErrorDef);
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { maximum: this.threshold };
  }
}

export function lessThan(threshold: number): LessThanLayoutTypeValidator {
  return new LessThanLayoutTypeValidator(threshold);
}

export const invalidLessThanEqualErrorDef = defineLayoutValidationError("invalid-less-than-or-equal");

export class LessThanOrEqualLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number, context: LayoutTypeValidationContext): void {
    if (value <= this.threshold) {
      return;
    }
    context.error(invalidLessThanEqualErrorDef);
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { exclusiveMaximum: this.threshold };
  }
}

export function lessThanOrEqual(threshold: number): LessThanOrEqualLayoutTypeValidator {
  return new LessThanOrEqualLayoutTypeValidator(threshold);
}

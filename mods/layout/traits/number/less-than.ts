import {
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
  registerLayoutValidationError,
} from "../../defs.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";

export const invalidLessThanErrorDef = registerLayoutValidationError("not-less-than");

export class LessThanLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) { }

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

export const invalidLessThanEqualErrorDef = registerLayoutValidationError("invalid-less-than-or-equal");

export class LessThanOrEqualLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) { }

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

import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutValidationError,
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidMaxStringLengthErrorDef = defineLayoutValidationError("invalid-max-string-length");

export class MaxStringLengthLayoutTypeValidator implements LayoutTypeValidator<string> {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: string, context: LayoutTypeValidationContext): void {
    if (value.length > this.threshold) {
      context.error(invalidMaxStringLengthErrorDef);
    }
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { maxLength: this.threshold };
  }
}

export function maxLength(threshold: number): MaxStringLengthLayoutTypeValidator {
  return new MaxStringLengthLayoutTypeValidator(threshold);
}

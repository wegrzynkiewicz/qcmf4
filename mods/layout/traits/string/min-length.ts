import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutValidationError,
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidMinStringLengthErrorDef = defineLayoutValidationError("invalid-min-string-length");

export class MinStringLengthLayoutTypeValidator implements LayoutTypeValidator<string> {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: string, context: LayoutTypeValidationContext): void {
    if (value.length < this.threshold) {
      context.error(invalidMinStringLengthErrorDef);
    }
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { minLength: this.threshold };
  }
}

export function minLength(threshold: number): MinStringLengthLayoutTypeValidator {
  return new MinStringLengthLayoutTypeValidator(threshold);
}

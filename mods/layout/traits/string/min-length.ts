import {
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
  registerLayoutValidationError,
} from "../../defs.ts";
import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";

export const invalidMinStringLengthErrorDef = registerLayoutValidationError("invalid-min-string-length");

export class MinStringLengthLayoutTypeValidator implements LayoutTypeValidator<string> {
  constructor(
    private threshold: number,
  ) { }

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

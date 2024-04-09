import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutError,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidMaxStringLengthErrorDef = defineLayoutError("invalid-max-string-length");

export class MaxStringLengthLayoutTypeValidator implements LayoutTypeValidator<string> {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: string): void {
    if (value.length > this.threshold) {
      throw invalidMaxStringLengthErrorDef.create({
        actual: value.length,
        expected: this.threshold,
      });
    }
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { maxLength: this.threshold };
  }
}

export function maxLength(threshold: number): MaxStringLengthLayoutTypeValidator {
  return new MaxStringLengthLayoutTypeValidator(threshold);
}

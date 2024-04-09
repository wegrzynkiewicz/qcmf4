import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutError,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidMinStringLengthErrorDef = defineLayoutError("invalid-min-string-length");

export class MinStringLengthLayoutTypeValidator implements LayoutTypeValidator<string> {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: string): void {
    if (value.length < this.threshold) {
      throw invalidMinStringLengthErrorDef.create({
        actual: value.length,
        expected: this.threshold,
      });
    }
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { minLength: this.threshold };
  }
}

export function minLength(threshold: number): MinStringLengthLayoutTypeValidator {
  return new MinStringLengthLayoutTypeValidator(threshold);
}

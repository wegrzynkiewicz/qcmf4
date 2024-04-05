import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutValidationError,
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidMinArrayItemsErrorDef = defineLayoutValidationError("invalid-min-array-items");

export class MinArrayItemsLayoutTypeValidator implements LayoutTypeValidator<unknown[]> {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: unknown[], context: LayoutTypeValidationContext): void {
    if (value.length < this.threshold) {
      context.error(invalidMinArrayItemsErrorDef);
    }
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { minItems: this.threshold };
  }
}

export function minItems(threshold: number): MinArrayItemsLayoutTypeValidator {
  return new MinArrayItemsLayoutTypeValidator(threshold);
}

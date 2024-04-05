import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutValidationError,
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidMaxArrayItemsErrorDef = defineLayoutValidationError("invalid-max-array-items");

export class MaxArrayItemsLayoutTypeValidator implements LayoutTypeValidator<unknown[]> {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: unknown[], context: LayoutTypeValidationContext): void {
    if (value.length > this.threshold) {
      context.error(invalidMaxArrayItemsErrorDef);
    }
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { maxItems: this.threshold };
  }
}

export function maxItems(threshold: number): MaxArrayItemsLayoutTypeValidator {
  return new MaxArrayItemsLayoutTypeValidator(threshold);
}

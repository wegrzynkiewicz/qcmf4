import {
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
  registerLayoutValidationError,
} from "../../defines.ts";
import { layoutSchemaGeneratorSymbol } from "../../schema/defines.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";

export const invalidMaxArrayItemsErrorDef = registerLayoutValidationError("invalid-max-array-items");

export class MaxArrayItemsLayoutTypeValidator implements LayoutTypeValidator<unknown[]> {
  constructor(
    private threshold: number,
  ) { }

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

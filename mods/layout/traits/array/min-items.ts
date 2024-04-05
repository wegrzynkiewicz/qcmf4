import {
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
  registerLayoutValidationError,
} from "../../defines.ts";
import { layoutSchemaGeneratorSymbol } from "../../schema/defines.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";

export const invalidMinArrayItemsErrorDef = registerLayoutValidationError( "invalid-min-array-items");

export class MinArrayItemsLayoutTypeValidator implements LayoutTypeValidator<unknown[]> {
  constructor(
    private threshold: number,
  ) { }

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

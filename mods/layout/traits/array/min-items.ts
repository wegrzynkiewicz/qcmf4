import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutError,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidMinArrayItemsErrorDef = defineLayoutError("invalid-min-array-items");

export class MinArrayItemsLayoutTypeValidator implements LayoutTypeValidator<unknown[]> {
  constructor(
    private threshold: number,
  ) { }

  [layoutTypeValidatorSymbol](value: unknown[]): void {
    if (value.length < this.threshold) {
      throw invalidMinArrayItemsErrorDef.create({
        actual: value.length,
        expected: this.threshold,
      });
    }
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { minItems: this.threshold };
  }
}

export function minItems(threshold: number): MinArrayItemsLayoutTypeValidator {
  return new MinArrayItemsLayoutTypeValidator(threshold);
}

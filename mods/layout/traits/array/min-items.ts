import { LayoutSchemaGenerator } from "../../schema.ts";
import { JSONSchema } from "../../json-schema-types.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { LayoutTypeValidator } from "../../parsing.ts";

export const invalidMinArrayItemsErrorDef = defineLayoutError(
  "invalid-min-array-items",
  "Array does not meet minimum item limit. Expected ({{threshold}}) or more.",
);

export class MinArrayItemsLayoutTypeValidator implements LayoutSchemaGenerator, LayoutTypeValidator<unknown[]> {
  public constructor(
    private threshold: number,
  ) {}

  public validate(value: unknown[]): LayoutResult<unknown[]> {
    const { threshold } = this;
    if (value.length < threshold) {
      return new SingleNegativeLayoutResult(invalidMinArrayItemsErrorDef, { value, threshold });
    }
    return new PositiveLayoutResult(value);
  }

  public generateSchema(): JSONSchema {
    return { minItems: this.threshold };
  }
}

export function minItems(threshold: number): MinArrayItemsLayoutTypeValidator {
  return new MinArrayItemsLayoutTypeValidator(threshold);
}

import { LayoutSchemaGenerator } from "../../schema.ts";
import { JSONSchema } from "../../json-schema-types.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { LayoutTypeValidator } from "../../parsing.ts";

export const invalidMaxArrayItemsErrorDef = defineLayoutError(
  "invalid-max-array-items",
  "Array exceeds maximum item limit. Expected ({{threshold}}) or less.",
);

export class MaxArrayItemsLayoutTypeValidator implements LayoutSchemaGenerator, LayoutTypeValidator<unknown[]> {
  public constructor(
    private threshold: number,
  ) {}

  public validate(value: unknown[]): LayoutResult<unknown[]> {
    const { threshold } = this;
    if (value.length > threshold) {
      return new SingleNegativeLayoutResult(invalidMaxArrayItemsErrorDef, { value, threshold });
    }
    return new PositiveLayoutResult(value);
  }

  public generateSchema(): JSONSchema {
    return { maxItems: this.threshold };
  }
}

export function maxItems(threshold: number): MaxArrayItemsLayoutTypeValidator {
  return new MaxArrayItemsLayoutTypeValidator(threshold);
}

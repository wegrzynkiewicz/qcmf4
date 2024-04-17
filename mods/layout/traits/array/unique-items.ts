import { JSONSchema } from "../../schema/json-schema-types.ts";
import { LayoutTypeValidator, layoutTypeValidatorSymbol } from "../../validation.ts";
import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { defineLayoutError, LayoutResult } from "../../flow.ts";
import { positiveResult } from "../../flow.ts";
import { negativeResult } from "../../flow.ts";

export const invalidUniqueArrayItemsErrorDef = defineLayoutError(
  "invalid-unique-array-items",
  "Array contains duplicate items.",
);

function onlyUnique<T>(value: T, index: number, array: T[]) {
  return array.indexOf(value) === index;
}

export class UniqueArrayItemsLayoutTypeValidator implements LayoutTypeValidator<unknown[]> {
  public [layoutTypeValidatorSymbol](value: unknown[]): LayoutResult<unknown[]> {
    const unique = value.filter(onlyUnique);
    if (value.length == unique.length) {
      return positiveResult(value);
    }
    return negativeResult(invalidUniqueArrayItemsErrorDef);
  }

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { uniqueItems: true };
  }
}

export function uniqueItems(): UniqueArrayItemsLayoutTypeValidator {
  return new UniqueArrayItemsLayoutTypeValidator();
}

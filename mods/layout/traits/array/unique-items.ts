import { JSONSchema } from "../../json-schema-types.ts";
import { defineLayoutError, LayoutResult } from "../../flow.ts";
import { PositiveLayoutResult } from "../../flow.ts";
import { SingleNegativeLayoutResult } from "../../flow.ts";
import { LayoutTypeValidator } from "../../parsing.ts";

export const invalidUniqueArrayItemsErrorDef = defineLayoutError(
  "invalid-unique-array-items",
  "Array contains duplicate items.",
);

function onlyUnique<T>(value: T, index: number, array: T[]) {
  return array.indexOf(value) === index;
}

export class UniqueArrayItemsLayoutTypeValidator implements LayoutTypeValidator<unknown[]> {
  public validate(value: unknown[]): LayoutResult<unknown[]> {
    const unique = value.filter(onlyUnique);
    if (value.length == unique.length) {
      return new PositiveLayoutResult(value);
    }
    return new SingleNegativeLayoutResult(invalidUniqueArrayItemsErrorDef);
  }

  public generateSchema(): JSONSchema {
    return { uniqueItems: true };
  }
}

export function uniqueItems(): UniqueArrayItemsLayoutTypeValidator {
  return new UniqueArrayItemsLayoutTypeValidator();
}

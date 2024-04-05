import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutValidationError,
  LayoutTypeValidationContext,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidUniqueArrayItemsErrorDef = defineLayoutValidationError("invalid-unique-array-items");

function onlyUnique<T>(value: T, index: number, array: T[]) {
  return array.indexOf(value) === index;
}

export class UniqueArrayItemsLayoutTypeValidator implements LayoutTypeValidator<unknown[]> {
  [layoutTypeValidatorSymbol](value: unknown[], context: LayoutTypeValidationContext): void {
    const unique = value.filter(onlyUnique);
    if (value.length == unique.length) {
      return;
    }
    context.error(invalidUniqueArrayItemsErrorDef);
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { uniqueItems: true };
  }
}

export function uniqueItems(): UniqueArrayItemsLayoutTypeValidator {
  return new UniqueArrayItemsLayoutTypeValidator();
}

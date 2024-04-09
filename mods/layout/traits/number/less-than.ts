import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import {
  defineLayoutError,
  LayoutTypeValidator,
  layoutTypeValidatorSymbol,
} from "../../validation/defs.ts";

export const invalidLessThanErrorDef = defineLayoutError("not-less-than");

export class LessThanLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number): void {
    if (value < this.threshold) {
      return;
    }
    throw invalidLessThanErrorDef.create({
      actual: value,
      expected: this.threshold,
    });
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { maximum: this.threshold };
  }
}

export function lessThan(threshold: number): LessThanLayoutTypeValidator {
  return new LessThanLayoutTypeValidator(threshold);
}

export const invalidLessThanEqualErrorDef = defineLayoutError("invalid-less-than-or-equal");

export class LessThanOrEqualLayoutTypeValidator implements LayoutTypeValidator<number>, LayoutSchemaGenerator {
  constructor(
    private threshold: number,
  ) {}

  [layoutTypeValidatorSymbol](value: number): void {
    if (value <= this.threshold) {
      return;
    }
    throw invalidLessThanEqualErrorDef.create({
      actual: value,
      expected: this.threshold,
    });
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { exclusiveMaximum: this.threshold };
  }
}

export function lessThanOrEqual(threshold: number): LessThanOrEqualLayoutTypeValidator {
  return new LessThanOrEqualLayoutTypeValidator(threshold);
}

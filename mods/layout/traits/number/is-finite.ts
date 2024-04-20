import { LayoutTypeValidator } from "../../parsing.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../../flow.ts";
import { JSONSchema } from "../../json-schema-types.ts";

export const invalidFiniteNumberErrorDef = defineLayoutError(
  "invalid-finite-number",
  "Value is not a finite number.",
);

export class IsFiniteNumberValidator implements LayoutTypeValidator<number> {
  public validate(value: number): LayoutResult<number> {
    if (Number.isFinite(value)) {
      return new PositiveLayoutResult(value);
    }
    return new SingleNegativeLayoutResult(invalidFiniteNumberErrorDef);
  }

  public generateSchema(): Partial<JSONSchema> {
    return {};
  }
}

export function isfinite(): LayoutTypeValidator<number> {
  return new IsFiniteNumberValidator();
}

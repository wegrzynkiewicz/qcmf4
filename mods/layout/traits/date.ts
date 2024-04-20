import { LayoutTrait } from "../defs.ts";
import { defineLayoutError, PositiveLayoutResult } from "../flow.ts";
import { SingleNegativeLayoutResult } from "../flow.ts";
import { LayoutResult } from "../flow.ts";
import { JSONSchema } from "../json-schema-types.ts";
import { LayoutTypeValidator } from "../parsing.ts";
import { WithValidatorsLayoutType } from "./with-validators.ts";

export const invalidDateErrorDef = defineLayoutError(
  "invalid-date",
  "Value is not a valid date.",
);

export function parseDate(date: Date): LayoutResult<Date> {
  if (Number.isNaN(date.getTime())) {
    return new SingleNegativeLayoutResult(invalidDateErrorDef);
  }
  return new PositiveLayoutResult(date);
}

export class DateLayoutType extends WithValidatorsLayoutType<Date> {
  public parse(value: unknown): LayoutResult<Date> {
    if (value instanceof Date) {
      return parseDate(value);
    }
    if (typeof value === "string") {
      const date = new Date(value);
      return parseDate(date);
    }
    return new SingleNegativeLayoutResult(invalidDateErrorDef);
  }

  public generatePrimaryTypeSchema(): JSONSchema {
    const targetSchema: JSONSchema = {
      type: "string",
      format: "date-time",
    };
    return targetSchema;
  }
}

export const date = (
  ...validators: LayoutTypeValidator<Date>[]
): LayoutTrait<Date> => {
  return new DateLayoutType(validators);
};

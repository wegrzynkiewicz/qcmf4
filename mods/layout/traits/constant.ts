import { LayoutTrait } from "../defs.ts";
import { JSONSchema } from "../json-schema-types.ts";
import { defineLayoutError, PositiveLayoutResult } from "../flow.ts";
import { LayoutResult } from "../flow.ts";
import { SingleNegativeLayoutResult } from "../flow.ts";
import { WithoutValidatorsLayoutType } from "./without-validation.ts";

export const invalidConstantErrorDef = defineLayoutError(
  "invalid-constant",
  "Value does not match the constant ({{constant}}).",
);

export class ConstantLayoutTrait<T extends string> extends WithoutValidatorsLayoutType<T> {
  private readonly uppercase: string;

  public constructor(
    public constant: T,
  ) {
    super();
    this.uppercase = constant.toLocaleUpperCase();
  }

  public parse(value: unknown): LayoutResult<T> {
    const { constant, uppercase } = this;
    if (typeof value !== "string") {
      return new SingleNegativeLayoutResult(invalidConstantErrorDef, { constant });
    }
    if (value.toLocaleUpperCase() === uppercase) {
      return new PositiveLayoutResult(constant) as LayoutResult<T>;
    }
    return new SingleNegativeLayoutResult(invalidConstantErrorDef, { constant });
  }

  public generateSchema(): JSONSchema {
    return { const: this.constant };
  }
}

export const constant = <T extends string>(constant: T): LayoutTrait<T> => {
  return new ConstantLayoutTrait<T>(constant);
};

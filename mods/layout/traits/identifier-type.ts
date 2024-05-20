import { Identifier } from "../../flow/identifier.ts";
import { LayoutTrait } from "../defs.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../flow.ts";
import { JSONSchema } from "../json-schema-types.ts";
import { WithoutValidatorsLayoutType } from "./without-validation.ts";

export const invalidIdentifierErrorDef = defineLayoutError(
  "invalid-identifier",
  "Value is not a valid identifier.",
);

export class IdentifierLayoutType extends WithoutValidatorsLayoutType<Identifier> {
  public parse(value: unknown): LayoutResult<Identifier> {
    if (typeof value !== "string") {
      return new SingleNegativeLayoutResult(invalidIdentifierErrorDef);
    }
    const identifier = Identifier.fromString(value);
    return new PositiveLayoutResult(identifier);
  }

  public generateSchema(): JSONSchema {
    return { type: "string" };
  }
}

export const identifier = (): LayoutTrait<Identifier> => {
  return new IdentifierLayoutType();
};

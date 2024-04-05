import { IsIntegerLayoutTypeValidator } from "./is-integer.ts";
import { AbstractLayoutType, layoutJSONSchemaTypeSymbol } from "../abstract-type.ts";
import { LayoutTrait } from "../../defs.ts";
import { LayoutTypeValidator } from "../../validation/defs.ts";

export class IntegerLayoutType extends AbstractLayoutType<number> {
  readonly [layoutJSONSchemaTypeSymbol] = "integer";
}

export const integer = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new IntegerLayoutType([
    new IsIntegerLayoutTypeValidator(),
    ...validators,
  ]);
};

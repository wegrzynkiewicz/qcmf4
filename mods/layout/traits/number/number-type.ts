import { IsNumberLayoutTypeValidator } from "./is-number.ts";
import { AbstractLayoutType, layoutJSONSchemaTypeSymbol } from "../abstract-type.ts";
import { LayoutTrait } from "../../defs.ts";
import { LayoutTypeValidator } from "../../validation/defs.ts";

export class NumberLayoutType extends AbstractLayoutType<number> {
  readonly [layoutJSONSchemaTypeSymbol] = "number";
}

export const unsafeNumber = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new NumberLayoutType(validators);
};

export const number = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new NumberLayoutType([
    new IsNumberLayoutTypeValidator(),
    ...validators,
  ]);
};

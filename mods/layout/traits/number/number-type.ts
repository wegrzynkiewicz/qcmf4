import { LayoutTrait, LayoutTypeValidator } from "../../defines.ts";
import { IsNumberLayoutTypeValidator } from "./is-number.ts";
import { AbstractLayoutType, layoutJSONSchemaTypeSymbol } from "../abstract-type.ts";

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

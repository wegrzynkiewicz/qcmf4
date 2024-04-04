import { LayoutTrait, LayoutTypeValidator } from "../defines.ts";
import { IsNumberLayoutTypeValidator } from "../validators/is-number.ts";
import { AbstractLayoutType } from "./abstract-type.ts";

export class NumberLayoutType extends AbstractLayoutType<number> {
  accept(value: unknown): boolean {
    return typeof value === "number";
  }
}

export const unsafeNumber = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new NumberLayoutType(validators);
}

export const number = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new NumberLayoutType([
    new IsNumberLayoutTypeValidator(),
    ...validators,
  ]);
}

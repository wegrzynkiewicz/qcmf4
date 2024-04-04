import { LayoutTrait, LayoutTypeValidator } from "../defines.ts";
import { IsNumberLayoutTypeValidator } from "../validators/is-number.ts";
import { AbstractLayoutType } from "./abstract-type.ts";

export class IntegerLayoutType extends AbstractLayoutType<number> {
  accept(value: unknown): boolean {
    return typeof value === "number";
  }
}

export const integer = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new IntegerLayoutType([
    new IsNumberLayoutTypeValidator(),
    ...validators,
  ]);
}

import { LayoutTrait, LayoutTypeValidator, UnknownLayout } from "../defines.ts";
import { InferLayout } from "../mod.ts";
import { AbstractLayoutType } from "./abstract-type.ts";

class ArrayLayoutType<T> extends AbstractLayoutType<T[]> {
  constructor(
    public itemsLayout: UnknownLayout,
    public validators: LayoutTypeValidator<unknown[]>[],
  ) {
    super(validators);
  }
}

export const array = <TLayout extends UnknownLayout, TResult = InferLayout<TLayout>>(
  itemsLayout: TLayout,
  ...validators: LayoutTypeValidator<unknown[]>[]
): LayoutTrait<TResult[]> => {
  return new ArrayLayoutType<TResult>(itemsLayout, validators);
}

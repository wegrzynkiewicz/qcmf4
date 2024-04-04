import { LayoutTrait, LayoutTypeValidator, layoutTraitSymbol } from "../defines.ts";

export abstract class AbstractLayoutType<T> implements LayoutTrait<T> {
  readonly [layoutTraitSymbol] = 1;
  constructor(
    public validators: LayoutTypeValidator<T>[],
  ) {}
}

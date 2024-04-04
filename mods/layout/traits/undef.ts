import { LayoutTrait, layoutTraitSymbol } from "../defines.ts";

export class UndefinedLayoutType implements LayoutTrait<undefined> {
  readonly [layoutTraitSymbol] = 1;
}

export const undef = new UndefinedLayoutType();

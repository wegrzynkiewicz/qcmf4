import { LayoutOptional, LayoutTrait, layoutOptionalSymbol, layoutTraitSymbol } from "../defines.ts";

export class OptionalLayoutType implements LayoutOptional, LayoutTrait<never> {
  readonly [layoutTraitSymbol] = 1;
  readonly [layoutOptionalSymbol] = 1;
}

export const optional: LayoutOptional = new OptionalLayoutType();

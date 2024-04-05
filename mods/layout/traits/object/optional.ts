import { LayoutOptional, layoutOptionalSymbol, LayoutTrait, layoutTraitSymbol } from "../../defines.ts";

export class OptionalLayoutType implements LayoutOptional, LayoutTrait<never> {
  readonly [layoutTraitSymbol] = 1;
  readonly [layoutOptionalSymbol] = 1;
}

export const optional: LayoutOptional = new OptionalLayoutType();

export function isOptionalLayoutType(value: any): value is LayoutOptional {
  return value && value[layoutOptionalSymbol] === 1;
}

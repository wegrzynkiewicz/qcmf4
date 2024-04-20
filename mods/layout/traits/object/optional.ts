import { LayoutOptional, layoutOptionalSymbol, LayoutTrait, UnknownLayout } from "../../defs.ts";

export class OptionalLayoutType implements LayoutOptional, LayoutTrait<never> {
  public readonly [layoutOptionalSymbol] = 1;

  public init(layout: UnknownLayout): void {
    layout.required = false;
  }
}

export const optional: LayoutOptional = new OptionalLayoutType();

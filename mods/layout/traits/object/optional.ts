import { isObject } from "../../../assert/asserts.ts";
import { LayoutOptional, layoutOptionalSymbol, LayoutTrait, layoutTraitSymbol } from "../../defs.ts";

export class OptionalLayoutType implements LayoutOptional, LayoutTrait<never> {
  readonly [layoutTraitSymbol] = 1;
  readonly [layoutOptionalSymbol] = 1;
}

export const optional: LayoutOptional = new OptionalLayoutType();

export function isOptionalLayoutType(value: unknown): value is LayoutOptional {
  return isObject(value) && layoutOptionalSymbol in value;
}

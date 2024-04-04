import { InferLayoutObject, LayoutTrait, UnknownLayoutMap, layoutTraitSymbol } from "../defines.ts";

export class LayoutObjectTrait<T extends UnknownLayoutMap> implements LayoutTrait<InferLayoutObject<T>> {
  readonly [layoutTraitSymbol] = 1;
  constructor(
    public fields: T,
  ) { }
}

export const object = <T extends UnknownLayoutMap>(fields: T): LayoutTrait<InferLayoutObject<T>> => {
  return new LayoutObjectTrait(fields);
}

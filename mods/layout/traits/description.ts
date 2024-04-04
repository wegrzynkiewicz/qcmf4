import { LayoutTrait, layoutTraitSymbol } from "../defines.ts";

export const description = (description: string): LayoutTrait<never> => {
  return {
    [layoutTraitSymbol]: 1,
  };
}

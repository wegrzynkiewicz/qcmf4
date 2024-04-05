import { LayoutTrait, layoutTraitSymbol } from "../defines.ts";

export const title = (title: string): LayoutTrait<never> => {
  return {
    [layoutTraitSymbol]: 1,
  };
};

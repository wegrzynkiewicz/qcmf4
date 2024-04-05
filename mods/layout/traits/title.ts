import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";

export const title = (title: string): LayoutTrait<never> => {
  return {
    [layoutTraitSymbol]: 1,
  };
};

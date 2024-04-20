import { LayoutKey, LayoutTrait, UnknownLayout } from "../defs.ts";

export class KeyLayoutTrait<T extends string> implements LayoutKey<T>, LayoutTrait<never> {
  public constructor(
    public key: T,
  ) {}

  public init(layout: UnknownLayout): void {
    layout.key = this.key;
  }
}

export const key = <T extends string>(name: T): LayoutKey<T> => {
  return new KeyLayoutTrait<T>(name);
};

import { InferArray } from "../useful/types.ts";
import { LayoutTypeParser } from "./parsing.ts";
import { LayoutSchemaGenerator } from "./schema.ts";

export class Layout<T> {
  public description: string = "";
  public key: string = "";
  public parsers: LayoutTypeParser<unknown>[] = [];
  public required = true;
  public schemaGenerators: LayoutSchemaGenerator[] = [];
  public title: string = "";

  public get optional(): boolean {
    return !this.required;
  }

  public constructor(
    public traits: UnknownLayoutTrait[],
  ) {
    for (const trait of traits) {
      trait.init(this);
    }
  }
}
export type UnknownLayout = Layout<unknown>;
export type UnknownLayoutArray = UnknownLayout[];
export type UnknownLayoutMap = Record<string, UnknownLayout>;

export function layout<T extends LayoutTrait<unknown>[]>(...args: T): Layout<T> {
  return new Layout(args);
}

export interface LayoutTrait<T> {
  init(layout: UnknownLayout): void;
}
export type UnknownLayoutTrait = LayoutTrait<unknown>;

export const layoutOptionalSymbol = Symbol("LayoutOptional");
export interface LayoutOptional extends LayoutTrait<never> {
  readonly [layoutOptionalSymbol]: 1;
}

export interface LayoutKey<T> extends LayoutTrait<never> {
  readonly key: T;
}

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type IsInUnion<TUnion, TSearch> = Extract<TUnion, TSearch> extends never ? false : true;

export type IsTraitInLayout<TLayout extends UnknownLayout, TTrait> = TLayout extends Layout<infer U>
  ? IsInUnion<InferArray<U>, TTrait>
  : false;

export type OptionalObjectProperties<T extends UnknownLayoutMap> = {
  [K in keyof T as IsTraitInLayout<T[K], LayoutOptional> extends true ? K : never]+?: InferLayout<T[K]>;
};

export type RequiredObjectProperties<T extends UnknownLayoutMap> = {
  [K in keyof T as IsTraitInLayout<T[K], LayoutOptional> extends false ? K : never]-?: InferLayout<T[K]>;
};

export type InferLayoutObject<T extends UnknownLayoutMap> = Expand<
  OptionalObjectProperties<T> & RequiredObjectProperties<T>
>;

export type InferEnumerate<T extends UnknownLayoutArray> = Expand<InferLayout<InferArray<T>>>;

export type InferLayoutArray<T extends UnknownLayoutArray> = Expand<InferLayout<InferArray<T>>[]>;

export type InferLayoutType<T> = T extends LayoutKey<unknown> ? never
  : T extends LayoutOptional ? never
  : T extends LayoutTrait<infer U> ? U
  : never;

export type InferLayoutKeyFromUnion<T> = T extends LayoutKey<infer U> ? U : never;
export type InferLayoutKey<T> = T extends Layout<infer U> ? InferLayoutKeyFromUnion<InferArray<U>> : never;

export type InferLayout<T extends UnknownLayout> = T extends Layout<infer U> ? InferLayoutType<InferArray<U>> : never;

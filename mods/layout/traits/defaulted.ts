import { layoutOptionalSymbol, LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema, JSONSchemaType } from "../schema/json-schema-types.ts";

export class DefaultLayoutTrait<T extends JSONSchemaType> implements LayoutSchemaGenerator, LayoutTrait<T> {
  readonly [layoutTraitSymbol] = 1;
  readonly [layoutOptionalSymbol] = 1;
  constructor(
    public factory: () => T,
  ) {}
  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { ["default"]: this.factory() };
  }
}

export const defaulted = <T extends JSONSchemaType>(factory: () => T): LayoutTrait<T> => {
  return new DefaultLayoutTrait<T>(factory);
};

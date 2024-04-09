import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema, JSONSchemaType } from "../schema/json-schema-types.ts";

export class ConstantLayoutTrait<T extends JSONSchemaType> implements LayoutSchemaGenerator, LayoutTrait<T> {
  readonly [layoutTraitSymbol] = 1;
  constructor(
    public constant: T,
  ) {}
  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { const: this.constant };
  }
}

export const constant = <T extends JSONSchemaType>(constant: T): LayoutTrait<T> => {
  return new ConstantLayoutTrait<T>(constant);
};

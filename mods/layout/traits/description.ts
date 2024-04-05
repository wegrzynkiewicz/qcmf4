import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";

export class DescriptionLayoutTrait implements LayoutSchemaGenerator, LayoutTrait<never> {
  readonly [layoutTraitSymbol] = 1;
  constructor(
    public description: string,
  ) {}
  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { description: this.description };
  }
}

export const description = (description: string): LayoutTrait<never> => {
  return new DescriptionLayoutTrait(description);
};

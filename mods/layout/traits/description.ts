import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";

export class DescriptionLayoutTrait implements LayoutSchemaGenerator, LayoutTrait<never> {
  public readonly [layoutTraitSymbol] = 1;

  public constructor(
    public description: string,
  ) {}

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    const { description } = this;
    return { description };
  }
}

export const description = (description: string): LayoutTrait<never> => {
  return new DescriptionLayoutTrait(description);
};

import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";

export class TitleLayoutTrait implements LayoutSchemaGenerator, LayoutTrait<never> {
  public readonly [layoutTraitSymbol] = 1;

  public constructor(
    public title: string,
  ) {}

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    const { title } = this;
    return { title };
  }
}

export const title = (title: string): LayoutTrait<never> => {
  return new TitleLayoutTrait(title);
};

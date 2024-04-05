import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";

export class TitleLayoutTrait implements LayoutSchemaGenerator, LayoutTrait<never> {
  readonly [layoutTraitSymbol] = 1;
  constructor(
    public title: string,
  ) {}
  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { title: this.title };
  }
}

export const title = (title: string): LayoutTrait<never> => {
  return new TitleLayoutTrait(title);
};

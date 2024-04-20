import { LayoutTrait, UnknownLayout } from "../defs.ts";
import { LayoutSchemaGenerator } from "../schema.ts";
import { JSONSchema } from "../json-schema-types.ts";

export class DescriptionLayoutTrait implements LayoutSchemaGenerator, LayoutTrait<never> {
  public constructor(
    public description: string,
  ) {}

  public generateSchema(): JSONSchema {
    const { description } = this;
    return { description };
  }

  public init(layout: UnknownLayout): void {
    layout.description = this.description;
    layout.schemaGenerators.push(this);
  }
}

export const description = (description: string): LayoutTrait<never> => {
  return new DescriptionLayoutTrait(description);
};

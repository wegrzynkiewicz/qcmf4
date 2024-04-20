import { LayoutTrait, UnknownLayout } from "../defs.ts";
import { LayoutSchemaGenerator } from "../schema.ts";
import { JSONSchema } from "../json-schema-types.ts";

export class TitleLayoutTrait implements LayoutSchemaGenerator, LayoutTrait<never> {
  public constructor(
    public title: string,
  ) {}

  public generateSchema(): JSONSchema {
    const { title } = this;
    return { title };
  }

  public init(layout: UnknownLayout): void {
    layout.title = this.title;
  }
}

export const title = (title: string): LayoutTrait<never> => {
  return new TitleLayoutTrait(title);
};

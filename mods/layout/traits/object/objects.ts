import { InferLayoutObject, LayoutTrait, layoutTraitSymbol, UnknownLayoutMap, UnknownLayoutTrait } from "../../defs.ts";
import { LayoutSchemaGenerator, LayoutSchemaGeneratorContext, layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";
import { isOptionalLayoutType } from "./optional.ts";

export function isRequiredField(traits: UnknownLayoutTrait[]): boolean {
  for (const trait of traits) {
    if (isOptionalLayoutType(trait)) {
      return false;
    }
  }
  return true;
}

export class LayoutObjectTrait<T extends UnknownLayoutMap>
  implements LayoutSchemaGenerator, LayoutTrait<InferLayoutObject<T>> {
  public readonly [layoutTraitSymbol] = 1;
  public constructor(
    public fields: T,
  ) {}

  public [layoutSchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): JSONSchema {
    const { schemaCreator } = context;
    const required: string[] = [];
    const properties = Object.entries(this.fields).map(([fieldName, layout]) => {
      if (isRequiredField(layout.traits)) {
        required.push(fieldName);
      }
      const schema = schemaCreator.create(layout);
      return [fieldName, schema];
    });
    return {
      type: "object",
      properties: Object.fromEntries(properties),
      required,
    };
  }
}

export const object = <T extends UnknownLayoutMap>(fields: T): LayoutTrait<InferLayoutObject<T>> => {
  return new LayoutObjectTrait(fields);
};

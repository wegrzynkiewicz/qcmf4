import { UnknownLayout, UnknownLayoutTrait } from "../defines.ts";
import { layoutSchemaGeneratorSymbol } from "./defines.ts";
import { isLayoutSchemaGenerator } from "./defines.ts";
import { JSONSchema } from "./mod.ts";

const emptySchema = {};

function createSchemaPerTrait(trait: UnknownLayoutTrait): JSONSchema {
  if (isLayoutSchemaGenerator(trait) === false) {
    return emptySchema;
  }
  const schema = trait[layoutSchemaGeneratorSymbol]();
  return schema;
}

export class JSONSchemaCreator {
  create(layout: UnknownLayout): JSONSchema {
    const schemas = layout.traits.map(createSchemaPerTrait);
    const resultSchema = Object.assign({}, ...schemas);
    return resultSchema;
  }
}

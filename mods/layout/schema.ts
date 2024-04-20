import { UnknownLayout } from "./defs.ts";
import { JSONSchema } from "./json-schema-types.ts";

export class LayoutJSONSchemaCreator {
  create(layout: UnknownLayout): JSONSchema {
    const schemas = layout.schemaGenerators.map((trait) => this.generateSchema(trait));
    const resultSchema = Object.assign({}, ...schemas);
    return resultSchema;
  }

  generateSchema(generator: LayoutSchemaGenerator): JSONSchema {
    const context: LayoutSchemaGeneratorContext = {
      schemaCreator: this,
    };
    const schema = generator.generateSchema(context);
    return schema;
  }
}

export interface LayoutSchemaGeneratorContext {
  schemaCreator: LayoutJSONSchemaCreator;
}

export interface LayoutSchemaGenerator {
  generateSchema(context: LayoutSchemaGeneratorContext): Partial<JSONSchema>;
}

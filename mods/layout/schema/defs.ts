import { isObject } from "../../assert/asserts.ts";
import { UnknownLayout } from "../defs.ts";
import { JSONSchema } from "./json-schema-types.ts";

export class LayoutJSONSchemaCreator {
  create(layout: UnknownLayout): JSONSchema {
    const schemas = layout.traits.map((trait) => this.generateSchema(trait));
    const resultSchema = Object.assign({}, ...schemas);
    return resultSchema;
  }
  generateSchema(generator: unknown | LayoutSchemaGenerator): JSONSchema {
    if (isLayoutSchemaGenerator(generator) === false) {
      return {};
    }
    const context: LayoutSchemaGeneratorContext = {
      schemaCreator: this,
    };
    const schema = generator[layoutSchemaGeneratorSymbol](context);
    return schema;
  }
}

export interface LayoutSchemaGeneratorContext {
  schemaCreator: LayoutJSONSchemaCreator;
}

export const layoutSchemaGeneratorSymbol = Symbol("LayoutSchemaGenerator");
export interface LayoutSchemaGenerator {
  [layoutSchemaGeneratorSymbol](context: LayoutSchemaGeneratorContext): Partial<JSONSchema>;
}
export function isLayoutSchemaGenerator(value: unknown): value is LayoutSchemaGenerator {
  return isObject(value) && layoutSchemaGeneratorSymbol in value;
}

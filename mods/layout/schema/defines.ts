import { JSONSchema7 } from "./json-schema-types.ts";

export const layoutSchemaGeneratorSymbol = Symbol("LayoutSchemaGenerator");
export interface LayoutSchemaGenerator {
  [layoutSchemaGeneratorSymbol](): Partial<JSONSchema7>;
}
export function isLayoutSchemaGenerator(value: any): value is LayoutSchemaGenerator {
  return value && value[layoutSchemaGeneratorSymbol] instanceof Function;
}

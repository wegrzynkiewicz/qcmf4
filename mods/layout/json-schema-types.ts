// ==================================================================================================
// JSON Schema Draft 07
// ==================================================================================================
// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
// --------------------------------------------------------------------------------------------------

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchemaTypeName =
  | "string" //
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null";

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchemaType =
  | string //
  | number
  | boolean
  | JSONSchemaObject
  | JSONSchemaArray
  | null;

// Workaround for infinite type recursion
export interface JSONSchemaObject {
  [key: string]: JSONSchemaType;
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface JSONSchemaArray extends Array<JSONSchemaType> {}

/**
 * Meta schema
 *
 * Recommended values:
 * - 'http://json-schema.org/schema#'
 * - 'http://json-schema.org/hyper-schema#'
 * - 'http://json-schema.org/draft-07/schema#'
 * - 'http://json-schema.org/draft-07/hyper-schema#'
 *
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-5
 */
export type JSONSchemaVersion = string;

/**
 * JSON Schema v7
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
 */
export type JSONSchemaDefinition = JSONSchema | boolean;
export interface JSONSchema {
  $id?: string | undefined;
  $ref?: string | undefined;
  $schema?: JSONSchemaVersion | undefined;
  $comment?: string | undefined;

  /**
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
   */
  $defs?: {
    [key: string]: JSONSchemaDefinition;
  } | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
   */
  type?: JSONSchemaTypeName | JSONSchemaTypeName[] | undefined;
  enum?: JSONSchemaType[] | undefined;
  const?: JSONSchemaType | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
   */
  multipleOf?: number | undefined;
  maximum?: number | undefined;
  exclusiveMaximum?: number | undefined;
  minimum?: number | undefined;
  exclusiveMinimum?: number | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
   */
  maxLength?: number | undefined;
  minLength?: number | undefined;
  pattern?: string | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
   */
  items?: JSONSchemaDefinition | JSONSchemaDefinition[] | undefined;
  additionalItems?: JSONSchemaDefinition | undefined;
  maxItems?: number | undefined;
  minItems?: number | undefined;
  uniqueItems?: boolean | undefined;
  contains?: JSONSchemaDefinition | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
   */
  maxProperties?: number | undefined;
  minProperties?: number | undefined;
  required?: string[] | undefined;
  properties?: {
    [key: string]: JSONSchemaDefinition;
  } | undefined;
  patternProperties?: {
    [key: string]: JSONSchemaDefinition;
  } | undefined;
  additionalProperties?: JSONSchemaDefinition | undefined;
  dependencies?: {
    [key: string]: JSONSchemaDefinition | string[];
  } | undefined;
  propertyNames?: JSONSchemaDefinition | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
   */
  if?: JSONSchemaDefinition | undefined;
  then?: JSONSchemaDefinition | undefined;
  else?: JSONSchemaDefinition | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
   */
  allOf?: JSONSchemaDefinition[] | undefined;
  anyOf?: JSONSchemaDefinition[] | undefined;
  oneOf?: JSONSchemaDefinition[] | undefined;
  not?: JSONSchemaDefinition | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
   */
  format?: string | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
   */
  contentMediaType?: string | undefined;
  contentEncoding?: string | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
   */
  definitions?: {
    [key: string]: JSONSchemaDefinition;
  } | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
   */
  title?: string | undefined;
  description?: string | undefined;
  default?: JSONSchemaType | undefined;
  readOnly?: boolean | undefined;
  writeOnly?: boolean | undefined;
  examples?: JSONSchemaType | undefined;
}

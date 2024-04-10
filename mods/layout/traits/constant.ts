import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { layoutTypeParserSymbol } from "../parsing/defs.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";
import { defineLayoutError } from "../validation/defs.ts";

export const invalidConstantErrorDef = defineLayoutError('invalid-constant');

export class ConstantLayoutTrait<T extends string> implements LayoutSchemaGenerator, LayoutTrait<T> {
  readonly [layoutTraitSymbol] = 1;
  private readonly uppercase: string;

  constructor(
    public constant: T,
  ) {
    this.uppercase = constant.toLocaleUpperCase();
  }

  [layoutTypeParserSymbol](value: unknown): string {
    const { constant, uppercase } = this;
    if (typeof value !== "string") {
      throw invalidConstantErrorDef.create();
    }
    if (value.toLocaleUpperCase() === uppercase) {
      return uppercase;
    }
    throw invalidConstantErrorDef.create({ constant });;
  }

  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { const: this.constant };
  }
}

export const constant = <T extends string>(constant: T): LayoutTrait<T> => {
  return new ConstantLayoutTrait<T>(constant);
};

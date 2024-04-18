import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { LayoutTypeParser, layoutTypeParserSymbol } from "../parsing.ts";
import { LayoutSchemaGenerator, layoutSchemaGeneratorSymbol } from "../schema/defs.ts";
import { JSONSchema } from "../schema/json-schema-types.ts";
import { defineLayoutError, PositiveLayoutResult } from "../flow.ts";
import { LayoutResult } from "../flow.ts";
import { SingleNegativeLayoutResult } from "../flow.ts";

export const invalidConstantErrorDef = defineLayoutError(
  "invalid-constant",
  "Value does not match the constant ({{constant}}).",
);

export class ConstantLayoutTrait<T extends string>
  implements LayoutSchemaGenerator, LayoutTypeParser<T>, LayoutTrait<T> {
  public readonly [layoutTraitSymbol] = 1;
  private readonly uppercase: string;

  public constructor(
    public constant: T,
  ) {
    this.uppercase = constant.toLocaleUpperCase();
  }

  public [layoutTypeParserSymbol](value: unknown): LayoutResult<T> {
    const { constant, uppercase } = this;
    if (typeof value !== "string") {
      return new SingleNegativeLayoutResult(invalidConstantErrorDef, { constant });
    }
    if (value.toLocaleUpperCase() === uppercase) {
      return new PositiveLayoutResult(constant) as LayoutResult<T>;
    }
    return new SingleNegativeLayoutResult(invalidConstantErrorDef, { constant });
  }

  public [layoutSchemaGeneratorSymbol](): JSONSchema {
    return { const: this.constant };
  }
}

export const constant = <T extends string>(constant: T): LayoutTrait<T> => {
  return new ConstantLayoutTrait<T>(constant);
};

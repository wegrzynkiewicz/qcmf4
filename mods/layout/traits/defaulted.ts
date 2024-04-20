import { layoutOptionalSymbol, LayoutTrait, UnknownLayout } from "../defs.ts";
import { LayoutTypeParser } from "../parsing.ts";
import { defineLayoutError, LayoutResult, PositiveLayoutResult, SingleNegativeLayoutResult } from "../flow.ts";
import { JSONSchema, JSONSchemaType } from "../json-schema-types.ts";
import { LayoutSchemaGenerator } from "../schema.ts";

export const invalidDefaultedErrorDef = defineLayoutError(
  "invalid-defaulted",
  "The default value cannot be used because the field must be undefined.",
);

export class DefaultLayoutTrait<T extends JSONSchemaType>
  implements LayoutSchemaGenerator, LayoutTypeParser<T>, LayoutTrait<T> {
  public readonly [layoutOptionalSymbol] = 1;

  public constructor(
    public factory: () => T,
  ) {}

  public parse(value: unknown): LayoutResult<T> {
    if (value === undefined) {
      const defaultedValue = this.factory();
      return new PositiveLayoutResult(defaultedValue);
    }
    return new SingleNegativeLayoutResult(invalidDefaultedErrorDef);
  }

  public generateSchema(): JSONSchema {
    return { ["default"]: this.factory() };
  }

  public init(layout: UnknownLayout): void {
    layout.schemaGenerators.push(this);
    layout.parsers.push(this);
    layout.required = false;
  }
}

export const defaulted = <T extends JSONSchemaType>(factory: () => T): LayoutTrait<T> => {
  return new DefaultLayoutTrait<T>(factory);
};

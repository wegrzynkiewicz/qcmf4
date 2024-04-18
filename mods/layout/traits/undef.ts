import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { defineLayoutError, LayoutResult, SingleNegativeLayoutResult } from "../flow.ts";
import { PositiveLayoutResult } from "../flow.ts";
import { LayoutTypeParser, layoutTypeParserSymbol } from "../parsing.ts";

export const invalidUndefinedErrorDef = defineLayoutError(
  "invalid-undefined",
  "Value is not undefined.",
);

export class UndefinedLayoutType implements LayoutTypeParser<undefined>, LayoutTrait<undefined> {
  public readonly [layoutTraitSymbol] = 1;

  public [layoutTypeParserSymbol](value: unknown): LayoutResult<undefined> {
    if (value === undefined) {
      return new PositiveLayoutResult(undefined);
    }
    return new SingleNegativeLayoutResult(invalidUndefinedErrorDef);
  }
}

export const undef = new UndefinedLayoutType();

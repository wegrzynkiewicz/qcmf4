import { LayoutTrait, layoutTraitSymbol } from "../defs.ts";
import { LayoutResult, defineLayoutError, negativeResult } from "../flow.ts";
import { positiveResult } from "../flow.ts";
import { LayoutTypeParser, layoutTypeParserSymbol } from "../parsing.ts";

export const invalidUndefinedErrorDef = defineLayoutError(
  "invalid-undefined",
  "Value is not undefined.",
);

export class UndefinedLayoutType implements LayoutTypeParser<undefined>, LayoutTrait<undefined> {
  public readonly [layoutTraitSymbol] = 1;

  public [layoutTypeParserSymbol](value: unknown): LayoutResult<undefined> {
    if (value === undefined) {
      return positiveResult(undefined);
    }
    return negativeResult(invalidUndefinedErrorDef);
  }
}

export const undef = new UndefinedLayoutType();

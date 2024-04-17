import { Breaker } from "../assert/breaker.ts";
import { isObject } from "../assert/asserts.ts";
import { InferLayout, UnknownLayout } from "./defs.ts";
import { isValidResult, LayoutResult, negativeResult } from "./flow.ts";
import { defineLayoutError } from "./flow.ts";
import { NegativeLayoutResult } from "./flow.ts";

export interface LayoutParserContext {
  parser: LayoutParser;
}

export const layoutTypeParserSymbol = Symbol("LayoutTypeParser");
export interface LayoutTypeParser<T> {
  [layoutTypeParserSymbol](value: unknown, context: LayoutParserContext): LayoutResult<T>;
}
export type UnknownLayoutTypeParser = LayoutTypeParser<unknown>;
export function isLayoutTypeParser(value: unknown): value is UnknownLayoutTypeParser {
  return isObject(value) && layoutTypeParserSymbol in value;
}

export const parserEmptyErrorDef = defineLayoutError(
  "parser-empty",
  "No validations have been provided.",
);

export const parserRejectedAllErrorDef = defineLayoutError(
  "parser-rejected-all",
  "None of the following validations have been accepted:",
);

export class LayoutParser {
  public parse<T extends UnknownLayout>(value: unknown, layout: T): LayoutResult<InferLayout<T>> {
    const context: LayoutParserContext = { parser: this };
    const tries: NegativeLayoutResult[] = [];
    for (const trait of layout.traits) {
      if (isLayoutTypeParser(trait) === false) {
        continue;
      }
      try {
        const result = trait[layoutTypeParserSymbol](value, context);
        if (isValidResult(result) === true) {
          return result as LayoutResult<InferLayout<T>>;
        }
        tries.push(result);
      } catch (error) {
        throw new Breaker("error-inside-layout-parser", { error, trait, value });
      }
    }
    const count = tries.length;
    if (count === 0) {
      return negativeResult(parserEmptyErrorDef);
    }
    if (count === 1) {
      return tries[0];
    }
    return negativeResult(parserRejectedAllErrorDef, { tries });
  }
}

export function provideLayoutParser() {
  return new LayoutParser();
}

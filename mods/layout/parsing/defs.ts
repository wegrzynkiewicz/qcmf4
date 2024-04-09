import { isObject } from "../../assert/asserts.ts";
import { InferLayout, UnknownLayout } from "../defs.ts";
import { defineLayoutError } from "../validation/defs.ts";

export interface LayoutParserContext {
  parser: LayoutParser;
}

export const layoutTypeParserSymbol = Symbol("LayoutTypeParser");
export interface LayoutTypeParser<T> {
  [layoutTypeParserSymbol](value: unknown, context: LayoutParserContext): T;
}
export type UnknownLayoutTypeParser = LayoutTypeParser<unknown>
export function isLayoutTypeParser(value: unknown,): value is UnknownLayoutTypeParser {
  return isObject(value) && layoutTypeParserSymbol in value;
}

export const allRejected = defineLayoutError("all-parser-rejected");

export class LayoutParser {
  public parse<T extends UnknownLayout>(value: unknown, layout: T): InferLayout<T> {
    const context: LayoutParserContext = { parser: this };
    for (const trait of layout.traits) {
      if (isLayoutTypeParser(trait) === false) {
        continue;
      }
      try {
        const parsedValue = trait[layoutTypeParserSymbol](value, context);
        return parsedValue as InferLayout<T>;
      } catch (error) {
        throw error;
      }
    }
    throw allRejected.create();
  }
}

export function provideLayoutParser() {
  return new LayoutParser();
}

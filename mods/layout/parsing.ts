import { Breaker } from "../assert/breaker.ts";
import { InferLayout, UnknownLayout } from "./defs.ts";
import {
  defineLayoutError,
  GroupingNegativeLayoutResult,
  LayoutResult,
  NegativeLayoutResult,
  PositiveLayoutResult,
  SingleNegativeLayoutResult,
} from "./flow.ts";
import { LayoutSchemaGenerator } from "./schema.ts";

export const parserEmptyErrorDef = defineLayoutError(
  "parser-empty",
  "No validations have been provided.",
);

export const parserRejectedAllErrorDef = defineLayoutError(
  "parser-rejected-all",
  "None of the following validations have been accepted",
);

export class LayoutParser {
  public parse<T extends UnknownLayout>(value: unknown, layout: T): LayoutResult<InferLayout<T>> {
    const context: LayoutParserContext = { parser: this };
    const tries: NegativeLayoutResult[] = [];
    for (const parser of layout.parsers) {
      try {
        const result = parser.parse(value, context);
        if (PositiveLayoutResult.is(result) === true) {
          return result as LayoutResult<InferLayout<T>>;
        }
        tries.push(result);
      } catch (error) {
        throw new Breaker("error-inside-layout-parser", { error, parser, value });
      }
    }
    const count = tries.length;
    if (count === 0) {
      return new SingleNegativeLayoutResult(parserEmptyErrorDef);
    }
    if (count === 1) {
      return tries[0];
    }
    return new GroupingNegativeLayoutResult(parserRejectedAllErrorDef, tries);
  }
}

export function provideLayoutParser() {
  return new LayoutParser();
}

export interface LayoutParserContext {
  parser: LayoutParser;
}

export interface LayoutTypeParser<T> {
  parse(value: unknown, context: LayoutParserContext): LayoutResult<T>;
}

export type UnknownLayoutTypeParser = LayoutTypeParser<unknown>;

export interface LayoutTypeValidator<T> extends LayoutSchemaGenerator {
  validate(value: T): LayoutResult<T>;
}
export type UnknownLayoutTypeValidator = LayoutTypeValidator<unknown>;

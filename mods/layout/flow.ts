import { isObject } from "../assert/asserts.ts";
import { Registry } from "../dependency/registry.ts";
import { bindVariables } from "../useful/strings.ts";

export type LayoutErrorData = Record<string, unknown>;

export const layoutResultSymbol = Symbol("LayoutResult");

export interface LayoutErrorDefinition {
  readonly kind: string;
  readonly defaultMessage?: string;
}

export interface PositiveLayoutResult<T> {
  readonly [layoutResultSymbol]: true;
  readonly value: T;
}

export function positiveResult<T>(value: T): PositiveLayoutResult<T> {
  return { value, [layoutResultSymbol]: true };
}

export interface NegativeLayoutResult {
  readonly data?: LayoutErrorData;
  readonly definition: LayoutErrorDefinition;
  readonly [layoutResultSymbol]: false;
}

export type LayoutResult<T> = PositiveLayoutResult<T> | NegativeLayoutResult;
export type UnknownLayoutResult = LayoutResult<unknown>;

export function negativeResult(definition: LayoutErrorDefinition, data?: LayoutErrorData): NegativeLayoutResult {
  return { data, definition, [layoutResultSymbol]: false };
}

export function isLayoutResult(value: unknown): value is LayoutResult<unknown> {
  return isObject(value) && layoutResultSymbol in value;
}

export function isValidResult<T>(result: LayoutResult<T>): result is PositiveLayoutResult<T> {
  return result[layoutResultSymbol] === true;
}

export function isNegativeResult<T>(result: UnknownLayoutResult): result is NegativeLayoutResult {
  return result[layoutResultSymbol] === false;
}

export const layoutErrorRegistry = new Registry<LayoutErrorDefinition>((e) => e.kind);

export function defineLayoutError(kind: string, defaultMessage?: string): LayoutErrorDefinition {
  const definition = { defaultMessage, kind };
  layoutErrorRegistry.register(definition);
  return definition;
}

export function formatNegativeLayoutResult(result: NegativeLayoutResult): string {
  const lines: string[] = [];
  const format = (value: unknown, indent: number): void => {
    if (isLayoutResult(value) && isNegativeResult(value)) {
      const { data, definition } = value;
      const { defaultMessage, kind } = definition;
      const label = bindVariables(defaultMessage ?? kind, data ?? {});
      const message = `${"  ".repeat(indent)}${label}`;
      lines.push(message);
      for (const child of Object.values(data ?? {})) {
        format(child, indent + 1);
      }
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        format(item, indent);
      }
    }
  };
  format(result, 0);
  const messages = lines.join("\n");
  return messages;
}

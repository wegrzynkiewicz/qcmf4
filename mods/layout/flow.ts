import { Registry } from "../dependency/registry.ts";
import { bindVariables } from "../useful/strings.ts";

export type LayoutErrorData = Record<string, unknown>;

export interface LayoutErrorDefinition {
  readonly kind: string;
  readonly defaultMessage?: string;
}

export class PositiveLayoutResult<T> {
  public readonly valid = true;
  public constructor(
    public readonly value: T,
  ) {}

  public static is<T>(result: LayoutResult<T>): result is PositiveLayoutResult<T> {
    return result.valid === true;
  }
}

export interface LayoutFormatContext {
  readonly indent: number;
  readonly lines: string[];
}

export class SingleNegativeLayoutResult {
  public readonly valid = false;
  public constructor(
    public readonly definition: LayoutErrorDefinition,
    public readonly data: LayoutErrorData = {},
  ) {}

  public static is(result: UnknownLayoutResult): result is SingleNegativeLayoutResult {
    return result.valid === false;
  }

  public format(context: LayoutFormatContext): void {
    const { indent, lines } = context;
    const { defaultMessage, kind } = this.definition;
    const label = bindVariables(defaultMessage ?? kind, this.data);
    const message = `${"  ".repeat(indent)}${label}`;
    lines.push(message);
  }
}

export class GroupingNegativeLayoutResult {
  public readonly valid = false;
  public constructor(
    public readonly definition: LayoutErrorDefinition,
    public readonly children: NegativeLayoutResult[],
    public readonly data: LayoutErrorData = {},
  ) {}

  public static is(result: UnknownLayoutResult): result is GroupingNegativeLayoutResult {
    return result.valid === false;
  }

  public format(context: LayoutFormatContext): void {
    const { indent, lines } = context;
    const { defaultMessage, kind } = this.definition;
    const count = this.children.length;
    if (count === 0) {
      return;
    }
    const label = bindVariables(defaultMessage ?? kind, this.data);
    const message = `${"  ".repeat(indent)}${label} {`;
    lines.push(message);
    for (const child of Object.values(this.children)) {
      const childContext: LayoutFormatContext = {
        indent: indent + 1,
        lines,
      };
      child.format(childContext);
    }
    lines.push(`${"  ".repeat(indent)}}`);
  }
}

export function isNegativeLayoutResult(result: UnknownLayoutResult): result is NegativeLayoutResult {
  return result.valid === false;
}

export type NegativeLayoutResult = SingleNegativeLayoutResult | GroupingNegativeLayoutResult;
export type LayoutResult<T> = PositiveLayoutResult<T> | SingleNegativeLayoutResult | GroupingNegativeLayoutResult;
export type UnknownLayoutResult = LayoutResult<unknown>;

export const layoutErrorRegistry = new Registry<LayoutErrorDefinition>((e) => e.kind);

export function defineLayoutError(kind: string, defaultMessage?: string): LayoutErrorDefinition {
  const definition = { defaultMessage, kind };
  layoutErrorRegistry.register(definition);
  return definition;
}

export function formatNegativeLayoutResult(result: NegativeLayoutResult): string {
  const lines: string[] = [];
  result.format({ indent: 0, lines });
  const message = lines.join("\n");
  return message;
}

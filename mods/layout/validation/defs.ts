import { isObject } from "../../assert/asserts.ts";
import { Breaker } from "../../assert/breaker.ts";
import { Registry } from "../../dependency/registry.ts";

export type LayoutErrorData = Record<string, unknown>;

export class LayoutError extends Breaker {
  public constructor(
    public readonly definition: LayoutErrorDefinition,
    additional?: LayoutErrorData,
  ) {
    super(definition.kind, additional);
    this.name = "LayoutError";
  }
}

export class LayoutErrorDefinition {
  public constructor(
    readonly kind: string,
  ) { }

  public create(additional?: LayoutErrorData): LayoutError {
    return new LayoutError(this, additional);
  }
}

export const layoutErrorRegistry = new Registry<LayoutErrorDefinition>((e) => e.kind);

export function defineLayoutError(kind: string): LayoutErrorDefinition {
  const definition = new LayoutErrorDefinition(kind);
  layoutErrorRegistry.register(definition);
  return definition;
}

export const layoutTypeValidatorSymbol = Symbol("LayoutTypeValidator");
export interface LayoutTypeValidator<T> {
  [layoutTypeValidatorSymbol](value: T): void;
}
export type UnknownLayoutTypeValidator = LayoutTypeValidator<unknown>
export function isLayoutTypeValidator(value: unknown): value is UnknownLayoutTypeValidator {
  return isObject(value) && layoutTypeValidatorSymbol in value;
}

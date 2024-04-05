import { Registry } from "../../dependency/registry.ts";

export type LayoutValidationErrorData = Record<string, unknown>;

export interface LayoutValidationErrorDefinition {
  readonly kind: string;
}

export const layoutValidationErrorRegistry = new Registry<LayoutValidationErrorDefinition>((e) => e.kind);

export function defineLayoutValidationError(
  kind: string,
): LayoutValidationErrorDefinition {
  const definition = { kind };
  layoutValidationErrorRegistry.register(definition);
  return definition;
}

export interface LayoutValidationErrorInstance {
  data?: LayoutValidationErrorData;
  definition: LayoutValidationErrorDefinition;
}

export class LayoutTypeValidationContext {
  valid = true;
  errors: LayoutValidationErrorInstance[] = [];
  error(
    definition: LayoutValidationErrorDefinition,
    data?: LayoutValidationErrorData,
  ): void {
    this.valid = false;
    const error = { definition, data };
    this.errors.push(error);
  }
}

export const layoutTypeValidatorSymbol = Symbol("LayoutTypeValidator");
export interface LayoutTypeValidator<T> {
  [layoutTypeValidatorSymbol](value: T, context: LayoutTypeValidationContext): void;
}

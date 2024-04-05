export type LayoutValidationErrorData = Record<string, unknown>;

export interface LayoutValidationErrorDefinitionInput {
  code: string;
  message: string;
}

export interface LayoutValidationErrorDefinition {
  readonly code: string;
  readonly message: string;
}

export function registerLayoutValidationError(
  code: string,
  message: string,
): LayoutValidationErrorDefinition {
  return { code, message };
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

export class Layout<T> {
  constructor(
    public traits: UnknownLayoutTrait[],
  ) {}
}
export type UnknownLayout = Layout<unknown>;
export type UnknownLayoutArray = UnknownLayout[];
export type UnknownLayoutMap = Record<string, UnknownLayout>;

export function layout<T extends LayoutTrait<unknown>[]>(...args: T): Layout<T> {
  return new Layout(args);
}

export const layoutTraitSymbol = Symbol("LayoutTrait");

export interface LayoutTrait<T> {
  readonly [layoutTraitSymbol]: 1;
}
export type UnknownLayoutTrait = LayoutTrait<unknown>;

export const layoutOptionalSymbol = Symbol("LayoutOptional");
export interface LayoutOptional extends LayoutTrait<never> {
  readonly [layoutOptionalSymbol]: 1;
}

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type IsInUnion<TUnion, TSearch> = Extract<TUnion, TSearch> extends never ? false : true;

export type IsTraitInLayout<TLayout extends UnknownLayout, TTrait> = TLayout extends Layout<infer U>
  ? IsInUnion<InferArray<U>, TTrait>
  : false;

export type OptionalObjectProperties<T extends UnknownLayoutMap> = {
  [K in keyof T as IsTraitInLayout<T[K], LayoutOptional> extends true ? K : never]+?: InferLayout<T[K]>;
};

export type RequiredObjectProperties<T extends UnknownLayoutMap> = {
  [K in keyof T as IsTraitInLayout<T[K], LayoutOptional> extends false ? K : never]: InferLayout<T[K]>;
};

export type InferLayoutObject<T extends UnknownLayoutMap> = Expand<
  OptionalObjectProperties<T> & RequiredObjectProperties<T>
>;

export type InferLayoutArray<T extends UnknownLayoutArray> = Expand<InferLayout<InferArray<T>>[]>;

export type InferLayoutType<T> = T extends LayoutOptional ? never : T extends LayoutTrait<infer U> ? U : never;

export type InferArray<T> = T extends Array<infer U> ? U : never;

export type InferLayout<T extends UnknownLayout> = T extends Layout<infer U> ? InferLayoutType<InferArray<U>> : never;

import { InferLayout, InferLayoutKey, UnknownLayout } from "../layout/defs.ts";
import { InferArray, UnionToIntersection } from "../useful/types.ts";

export interface VariableEndpointParameter<TName extends string, TValue> {
  key: TName;
  layout: UnknownLayout;
  type: "variable";
}
export type InferVariableEndpointParameter<T> = T extends VariableEndpointParameter<infer TKey, infer TValue>
  ? { [K in TKey]: TValue }
  : never;

export interface SegmentEndpointParameter {
  key: string;
  type: "constant";
}

export type EndpointParameter =
  | VariableEndpointParameter<string, UnknownLayout>
  | SegmentEndpointParameter;
export type InferEndpointParameters<T> = UnionToIntersection<InferVariableEndpointParameter<InferArray<T>>>;

export function segment(key: string): SegmentEndpointParameter {
  return { key, type: "constant" };
}

export function variable<TLayout extends UnknownLayout>(
  layout: TLayout,
): VariableEndpointParameter<InferLayoutKey<TLayout>, InferLayout<TLayout>> {
  const key = layout.key as InferLayoutKey<TLayout>;
  return { key, layout, type: "variable", };
}

export interface EndpointParametersContract<T> {
  segments: EndpointParameter[];
  urlPattern: URLPattern;
}
export type InferEndpointParametersContract<T> = T extends EndpointParametersContract<infer TParameters>
  ? TParameters
  : never;

export function mapToURLPattern({ key, type }: EndpointParameter): string {
  switch (type) {
    case "constant":
      return `/${key}`;
    case "variable":
      return `/:${key}`;
  }
}

export function defineEndpointParameters<T extends EndpointParameter[]>(
  ...segments: T
): EndpointParametersContract<InferEndpointParameters<T>> {
  const pathname = segments.map(mapToURLPattern).join("");
  const urlPattern = new URLPattern({ pathname });
  return { urlPattern, segments };
}

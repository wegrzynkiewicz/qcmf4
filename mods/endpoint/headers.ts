import { InferLayoutKey } from "../layout/defs.ts";
import { InferLayout, UnknownLayout } from "../layout/defs.ts";
import { InferArray, UnionToIntersection } from "../useful/types.ts";

export interface EndpointHeaderContract<TName extends string, TValue> {
  __?: () => TValue;
  layout: UnknownLayout;
}
export type UnknownEndpointHeaderContract = EndpointHeaderContract<string, unknown>;

export function defineEndpointHeader<
  TLayout extends UnknownLayout,
>(
  layout: TLayout,
): EndpointHeaderContract<InferLayoutKey<TLayout>, InferLayout<TLayout>> {
  return { layout };
}

export type InferEndpointHeader<T> = T extends EndpointHeaderContract<infer TKey, infer TValue>
  ? { [K in TKey]: TValue }
  : never;
export type InferEndpointHeaders<T> = UnionToIntersection<InferEndpointHeader<InferArray<T>>>;

export interface EndpointHeadersContract<TValue> {
  __?: () => TValue;
  items: UnknownEndpointHeaderContract[];
}
export type InferEndpointHeadersContract<T> = T extends EndpointHeadersContract<infer TValue> ? TValue : never;

export function defineEndpointHeaders<THeaders extends UnknownEndpointHeaderContract[]>(
  ...items: THeaders
): EndpointHeadersContract<InferEndpointHeaders<THeaders>> {
  return { items };
}

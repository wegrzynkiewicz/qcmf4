import { InferLayout } from "../layout/defs.ts";
import { UnknownLayout } from "../layout/defs.ts";

export interface EndpointBodyContract<T> {
  __?: () => T;
  contentType: string;
}

export interface JSONEndpointBodyContract<TBody> extends EndpointBodyContract<TBody> {
  contentType: "application/json";
  layout: UnknownLayout;
}

export function defineJSONEndpointBody<TLayout extends UnknownLayout>(
  layout: TLayout,
): JSONEndpointBodyContract<InferLayout<TLayout>> {
  return {
    contentType: "application/json",
    layout,
  };
}

export type InferEndpointBody<T> = T extends EndpointBodyContract<infer TValue>
  ? TValue
  : never;

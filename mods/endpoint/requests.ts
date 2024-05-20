import { EndpointBodyContract } from "./bodies.ts";
import { EndpointHeadersContract } from "./headers.ts";
import { EndpointParametersContract } from "./params.ts";

export type EndpointMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

export interface EndpointRequestContract<
  TBody extends EndpointBodyContract<unknown> | null,
  THeaders extends EndpointHeadersContract<unknown>,
  TParams extends EndpointParametersContract<unknown>,
> {
  body: TBody | null;
  description: string;
  headers: THeaders;
  key: string;
  method: EndpointMethod;
  params: TParams;
}
export type UnknownEndpointRequestContract = EndpointRequestContract<
  EndpointBodyContract<unknown> | null,
  EndpointHeadersContract<unknown>,
  EndpointParametersContract<unknown>
>;

export function defineEndpointRequest<
  TBody extends EndpointBodyContract<unknown> | null,
  THeaders extends EndpointHeadersContract<unknown>,
  TParams extends EndpointParametersContract<unknown>,
>(
  { body, description, headers, key, method, params }: {
    body: TBody;
    description: string;
    headers: THeaders;
    key: string;
    method: EndpointMethod;
    params: TParams;
  },
) {
  const contract: EndpointRequestContract<TBody, THeaders, TParams> = {
    body,
    description,
    headers,
    key,
    method,
    params,
  };
  return contract;
}

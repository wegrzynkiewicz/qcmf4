import { Breaker } from "../assert/breaker.ts";
import { EndpointBodyContract, InferEndpointBody } from "./bodies.ts";
import { EndpointHeadersContract, InferEndpointHeaders } from "./headers.ts";

export interface EndpointResponseContract<
  TBody extends EndpointBodyContract<unknown> | null,
  TEndpointHeadersContract extends EndpointHeadersContract<unknown>,
> {
  body: TBody | null;
  description: string;
  headers: TEndpointHeadersContract;
  key: string;
  status: number;
}
export type UnknownEndpointResponseContract = EndpointResponseContract<
  EndpointBodyContract<unknown> | null,
  EndpointHeadersContract<unknown>
>;

export function defineEndpointResponse<
  TBody extends EndpointBodyContract<unknown> | null,
  TEndpointHeadersContract extends EndpointHeadersContract<unknown>,
>(
  { body, description, headers, key, status }: {
    body: TBody;
    description: string;
    headers: TEndpointHeadersContract;
    key: string;
    status: number;
  },
) {
  const contract: EndpointResponseContract<TBody, TEndpointHeadersContract> = {
    body,
    description,
    headers,
    key,
    status,
  };
  return contract;
}

export function jsonResponse<TResponseContract extends UnknownEndpointResponseContract>(
  contract: TResponseContract,
  payload: InferEndpointBody<TResponseContract['body']>,
  headers?: InferEndpointHeaders<TResponseContract['headers']>,
): Response {
  const { body, status } = contract;
  if (body === null) {
    throw new Breaker('invalid-endpoint-response-body-contract', { contract })
  }
  if (body.contentType !== 'application/json') {
    throw new Breaker('invalid-endpoint-response-json-body-contract', { contract })
  }
  if (status === 204) {
    return new Response(null, { headers, status });
  }
  return Response.json(payload, { headers, status });
}

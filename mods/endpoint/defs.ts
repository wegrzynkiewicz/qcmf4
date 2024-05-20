import { InferEndpointBody } from "./bodies.ts";
import { InferEndpointHeadersContract } from "./headers.ts";
import { InferEndpointParametersContract } from "./params.ts";
import { UnknownEndpointRequestContract } from "./requests.ts";
import { UnknownEndpointResponseContract } from "./responses.ts";

export interface EndpointContract<
  TRequest extends UnknownEndpointRequestContract,
  TResponses extends UnknownEndpointResponseContract[],
> {
  key: string;
  request: TRequest;
  responses: TResponses;
  securities: EndpointSecuritySchemaContract[];
}
export type UnknownEndpointContract = EndpointContract<UnknownEndpointRequestContract, UnknownEndpointResponseContract[]>;

export interface EndpointSecuritySchemaContract {
  key: string;
  data: unknown;
}

export function defineEndpointSecuritySchema(
  { key, data }: {
    key: string;
    data: unknown;
  }
): EndpointSecuritySchemaContract {
  return { key, data };
}

export function defineEndpoint<
  TRequest extends UnknownEndpointRequestContract,
  TResponses extends UnknownEndpointResponseContract[],
>(
  { key, request, responses, securities }: {
    key: string;
    request: TRequest;
    responses: TResponses;
    securities: EndpointSecuritySchemaContract[];
  },
): EndpointContract<TRequest, TResponses> {
  return { key, request, responses, securities };
}

export interface EndpointInput<TRequestContract extends UnknownEndpointRequestContract> {
  body: InferEndpointBody<TRequestContract['body']>;
  contract: TRequestContract
  params: InferEndpointParametersContract<TRequestContract['params']>;
  request: Request;
  headers: InferEndpointHeadersContract<TRequestContract['headers']>;
}

export interface EndpointHandler<TEndpointContract extends UnknownEndpointContract> {
  handle(input: EndpointInput<TEndpointContract["request"]>): Promise<Response>;
}
export type UnknownEndpointHandler = EndpointHandler<UnknownEndpointContract>;


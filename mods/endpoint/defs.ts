import { Breaker } from "../assert/breaker.ts";
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
  if (responses.length === 0) {
    throw new Breaker('endpoint-must-have-at-least-one-response');
  }
  return { key, request, responses, securities };
}

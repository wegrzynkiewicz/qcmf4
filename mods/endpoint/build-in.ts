import { layout } from "../layout/defs.ts";
import { description } from "../layout/traits/description.ts";
import { key } from "../layout/traits/key.ts";
import { object } from "../layout/traits/object/objects.ts";
import { optional } from "../layout/traits/object/optional.ts";
import { string } from "../layout/traits/string/string-type.ts";
import { unknown } from "../layout/traits/unknown-type.ts";
import { defineJSONEndpointBody } from "./bodies.ts";
import { defineEndpointHeader, defineEndpointHeaders } from "./headers.ts";
import { defineEndpointResponse } from "./responses.ts";

export const authorizationHeaderDef = defineEndpointHeader(
  layout(
    key("Authorization"),
    description("The authorization header"),
    string(),
  ),
);

export const contentTypeHeaderDef = defineEndpointHeader(
  layout(
    key("Content-Type"),
    description("The content-type header"),
    string(),
  ),
);

export const defaultRequestHeaders = defineEndpointHeaders(
  authorizationHeaderDef,
  contentTypeHeaderDef,
);

export const errorOutputLayout = layout(
  object({
    error: layout(string()),
    metadata: layout(unknown, optional),
  }),
);

export const internalErrorEndpointResponseContract = defineEndpointResponse({
  body: defineJSONEndpointBody(errorOutputLayout),
  description: "An internal server error occurred",
  headers: defineEndpointHeaders(),
  key: "internal-error-response",
  status: 500,
});

export const badRequestErrorEndpointResponseContract = defineEndpointResponse({
  body: defineJSONEndpointBody(errorOutputLayout),
  description: "The request was malformed",
  headers: defineEndpointHeaders(),
  key: "bad-request-error-response",
  status: 400,
});

export const notFoundErrorEndpointResponseContract = defineEndpointResponse({
  body: defineJSONEndpointBody(errorOutputLayout),
  description: "The requested resource was not found",
  headers: defineEndpointHeaders(),
  key: "not-found-error-response",
  status: 404,
});

import { defineJSONEndpointBody } from "../../endpoint/bodies.ts";
import { defineEndpoint } from "../../endpoint/defs.ts";
import { defineEndpointHeaders } from "../../endpoint/headers.ts";
import { defineEndpointParameters, segment } from "../../endpoint/params.ts";
import { defineEndpointRequest } from "../../endpoint/requests.ts";
import { defineEndpointResponse } from "../../endpoint/responses.ts";
import { InferLayout, layout } from "../../layout/defs.ts";
import { constant } from "../../layout/traits/constant.ts";
import { date } from "../../layout/traits/date.ts";
import { object } from "../../layout/traits/object/objects.ts";

export const healthEndpointRequestContract = defineEndpointRequest({
  body: null,
  description: "Health test request",
  headers: defineEndpointHeaders(),
  key: "health-read-request",
  method: "GET",
  params: defineEndpointParameters(
    segment("health"),
  ),
});

export const healthOutputLayout = layout(
  object({
    date: layout(
      date(),
    ),
    status: layout(
      constant("UP"),
    ),
  }),
);
export type HealthOutput = InferLayout<typeof healthOutputLayout>;

export const healthEndpointResponseContract = defineEndpointResponse({
  body: defineJSONEndpointBody(healthOutputLayout),
  description: "Health test response",
  headers: defineEndpointHeaders(),
  key: "health-read-response",
  status: 200,
});

export const healthEndpointContract = defineEndpoint({
  key: "health-read-endpoint",
  request: healthEndpointRequestContract,
  responses: [healthEndpointResponseContract],
  securities: [],
});

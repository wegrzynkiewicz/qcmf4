import { EndpointHandler } from "../../endpoint/defs.ts";
import { jsonResponse } from "../../endpoint/responses.ts";
import { HealthOutput, healthEndpointResponseContract } from "./health-endpoint.ts";
import { healthEndpointContract } from "./health-endpoint.ts";

export class HealthEndpointHandler implements EndpointHandler<typeof healthEndpointContract> {
  async handle(): Promise<Response> {
    const payload: HealthOutput = {
      date: new Date(),
      status: 'UP',
    }
    return jsonResponse(healthEndpointResponseContract, payload);
  }
}

export function provideHealthEndpointHandler() {
  return new HealthEndpointHandler();
}

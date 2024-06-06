import { Breaker } from "../assert/breaker.ts";
import { Provider, ServiceResolver } from "../dependency/service-resolver.ts";
import { isJSONEndpointBodyContract } from "../endpoint/bodies.ts";
import { badRequestErrorEndpointResponseContract } from "../endpoint/build-in.ts";
import { UnknownEndpointContract } from "../endpoint/defs.ts";
import { jsonResponse } from "../endpoint/responses.ts";
import { UnknownActionContract, provideActionRunner } from "./action.ts";
import { isNegativeLayoutResult, formatNegativeLayoutResult } from "../layout/flow.ts";
import { provideLayoutParser } from "../layout/parsing.ts";
import { WebHandler } from "../web/defs.ts";

export function createActionWebHandler<
  TEndpointContract extends UnknownEndpointContract,
  TActionContract extends UnknownActionContract
>(
  endpointContract: TEndpointContract,
  actionContract: TActionContract,
): Provider<WebHandler> {
  return function provideActionWebHandler(resolver: ServiceResolver) {
    const runner = resolver.resolve(provideActionRunner);
    const parser = resolver.resolve(provideLayoutParser);

    const handle = async (request: Request): Promise<Response> => {

      let body = null;
      const bodyContract = endpointContract.request.body;
      if (isJSONEndpointBodyContract(bodyContract)) {
        const payload = await request.json();
        const result = parser.parse(payload, bodyContract.layout);
        if (isNegativeLayoutResult(result)) {
          const error = "bad-request";
          const metadata = formatNegativeLayoutResult(result);
          return jsonResponse(badRequestErrorEndpointResponseContract, { error, metadata });
        }
        body = result.value;
      }

  
      try {
        const [valid, result] = await runner.run(actionContract, body, null);
        if (valid === true) {
          const response = jsonResponse(endpointContract.responses[0], result);
        }

        return response;
      } catch (error: unknown) {
        throw new Breaker("error-inside-action-web-handler", { actionKey: actionContract.key, error });
      }
    }

    return { handle };
  }
}

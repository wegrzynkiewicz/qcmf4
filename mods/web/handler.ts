import { EndpointHandler, EndpointInput, UnknownEndpointContract } from "../endpoint/defs.ts";
import { Provider, ServiceResolver } from "../dependency/service-resolver.ts";
import { WebServerHandler, provideEndpointContract } from "./defs.ts";
import { Breaker } from "../assert/breaker.ts";
import { provideLayoutParser } from "../layout/parsing.ts";
import { isJSONEndpointBodyContract } from "../endpoint/bodies.ts";
import { formatNegativeLayoutResult, isNegativeLayoutResult } from "../layout/flow.ts";
import { badRequestErrorEndpointResponseContract } from "../endpoint/build-in.ts";
import { jsonResponse } from "../endpoint/responses.ts";

export function createWebServerHandlerFromEndpointHandler<TContract extends UnknownEndpointContract>(
  provider: Provider<EndpointHandler<TContract>>
) {
  return function provide(resolver: ServiceResolver): WebServerHandler {
    const endpointHandler = resolver.resolve(provider);
    const contract = resolver.resolve(provideEndpointContract);
    const layoutParser = resolver.resolve(provideLayoutParser);
    const contractKey = contract.key;

    const handle = async (request: Request) => {
      const payload = await request.json();
      
      let body = null;
      const bodyContract = contract.request.body;
      if (isJSONEndpointBodyContract(bodyContract)) {
        const result = layoutParser.parse(payload, bodyContract.layout);
        if (isNegativeLayoutResult(result)) {
          const error = "bad-request";
          const metadata = formatNegativeLayoutResult(result);
          return jsonResponse(badRequestErrorEndpointResponseContract, { error, metadata });
        }
        body = result.value;
      }

      const input = {
        body,
        contract,
        headers: {},
        params: {},
        request,
      } as unknown as EndpointInput<TContract["request"]>;

      try {
        const response = await endpointHandler.handle(input);
        return response;
      } catch (error: unknown) {
        throw new Breaker("error-inside-endpoint-mapper-web-handler", { contractKey, error });
      }
    };

    return { handle }
  }
}

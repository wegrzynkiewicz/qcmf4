import { definePermission, defineSecurityPolicy } from "../../../flow/auth.ts";
import { defineJSONEndpointBody } from "../../../endpoint/bodies.ts";
import { defaultRequestHeaders, internalErrorEndpointResponseContract } from "../../../endpoint/build-in.ts";
import { defineEndpoint, EndpointInput, EndpointHandler } from "../../../endpoint/defs.ts";
import { defineEndpointParameters, segment, variable } from "../../../endpoint/params.ts";
import { defineEndpointRequest } from "../../../endpoint/requests.ts";
import { defineEndpointResponse, jsonResponse } from "../../../endpoint/responses.ts";
import { Identifier } from "../../../flow/identifier.ts";
import { defineAction } from "../../../flow/action.ts";
import { layout, InferLayout } from "../../../layout/defs.ts";
import { identifier } from "../../../layout/traits/identifier-type.ts";
import { key } from "../../../layout/traits/key.ts";
import { object } from "../../../layout/traits/object/objects.ts";
import { string } from "../../../layout/traits/string/string-type.ts";
import { defaultPermissionsContracts, apiTokenEndpointSecuritySchemaContract } from "../../security.ts";

export type UserCreatePointer = {
  organizationId: Identifier;
}

export const userCreateInputLayout = layout(
  object({
    firstName: layout(string()),
    surname: layout(string()),
  }),
);
export type UserCreateInput = InferLayout<typeof userCreateInputLayout>;

export const userCreateOutputLayout = layout(
  object({
    userId: layout(identifier()),
  }),
);
export type UserCreateOutput = InferLayout<typeof userCreateOutputLayout>;

export const userCreatePermissionContract = definePermission<null>({
  key: 'user-create',
});

export const userCreatePermissionPolicy = defineSecurityPolicy(
  ...defaultPermissionsContracts,
  userCreatePermissionContract,
)

export const userCreateMutationContract = defineAction<UserCreatePointer, UserCreateInput, UserCreateOutput>({
  key: 'user-create',
  mutation: true,
  security: userCreatePermissionPolicy,
});

export const userCreateEndpointRequestContract = defineEndpointRequest({
  body: defineJSONEndpointBody(userCreateInputLayout),
  description: "Create a new user",
  headers: defaultRequestHeaders,
  method: "POST",
  key: "user-create-request",
  params: defineEndpointParameters(
    segment("organizations"),
    variable(
      layout(
        key("organizationId"),
        string(),
      ),
    ),
    segment("users"),
  ),
});

export const userCreateEndpointResponseContract = defineEndpointResponse({
  body: defineJSONEndpointBody(userCreateOutputLayout),
  description: "The user was created",
  headers: defaultRequestHeaders,
  key: "user-create-response",
  status: 204,
});

export const userCreateEndpointContract = defineEndpoint({
  key: "user-create-endpoint",
  request: userCreateEndpointRequestContract,
  responses: [
    internalErrorEndpointResponseContract,
    userCreateEndpointResponseContract,
  ] as const,
  securities: [
    apiTokenEndpointSecuritySchemaContract,
  ],
});

export class UserCreateEndpointHandler implements EndpointHandler<typeof userCreateEndpointContract> {
  async handle(input: EndpointInput<typeof userCreateEndpointRequestContract>): Promise<Response> {
    const { params, body, headers } = input;
    return jsonResponse(userCreateEndpointResponseContract, { userId: Identifier.fromString('123') });
  }
}

export function provideUserCreateEndpointHandler() {
  return new UserCreateEndpointHandler();
}

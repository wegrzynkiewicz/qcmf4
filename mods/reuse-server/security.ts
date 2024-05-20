import { definePermission } from "../flow/auth.ts";
import { defineEndpointSecuritySchema } from "../endpoint/defs.ts";
import { Identifier } from "../flow/identifier.ts";

export interface OrganizationPointer {
  organizationId: Identifier;
}

export const organizationMemberPermissionContract = definePermission<OrganizationPointer>({
  key: "organization-member",
});

export const apiTokenEndpointSecuritySchemaContract = defineEndpointSecuritySchema({
  key: "apiToken",
  data: {
    type: "http",
    scheme: "bearer",
  },
});

export const defaultPermissionsContracts = [
  organizationMemberPermissionContract
] as const;

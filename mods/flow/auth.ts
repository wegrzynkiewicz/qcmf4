import { UnionToIntersection, InferArray } from "../useful/types.ts";

export interface PermissionContract<TPointer> {
  key: string;
}
export type UnknownPermissionContract = PermissionContract<unknown>;
export type InferPermissionContract<T> = T extends PermissionContract<infer TPointer>
  ? TPointer extends object ? TPointer : never
  : never;

export function definePermission<TPointer>(
  { key }: {
    key: string;
  }
): PermissionContract<TPointer> {
  return { key };
}

export interface SecurityPolicyContract<TPointer> {
  __?: () => TPointer;
  permissions: UnknownPermissionContract[];
}
export type InferSecurityPolicyContract<T> = UnionToIntersection<InferPermissionContract<InferArray<T>>>;

export function defineSecurityPolicy<TPermissionContracts extends UnknownPermissionContract[]>(
  ...permissions: TPermissionContracts
): SecurityPolicyContract<InferSecurityPolicyContract<TPermissionContracts>> {
  return { permissions };
}

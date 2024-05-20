import { SecurityPolicyContract } from "./auth.ts";

export interface MutationContract<TPointer, TInput, TOutput> {
  key: string;
  security: SecurityPolicyContract<TPointer>;
}

export function defineMutation<TPointer, TInput, TOutput>(
  { key, security }: {
    key: string;
    security: SecurityPolicyContract<TPointer>;
  }
): MutationContract<TPointer, TInput, TOutput> {
  return { key, security };
}

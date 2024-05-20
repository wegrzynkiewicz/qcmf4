import { SecurityPolicyContract } from "./auth.ts";

export interface ActionContract<TPointer, TInput, TOutput> {
  key: string;
  mutation: boolean;
  security: SecurityPolicyContract<TPointer>;
}

export function defineAction<TPointer, TInput, TOutput>(
  { key, mutation, security }: {
    key: string;
    mutation: boolean;
    security: SecurityPolicyContract<TPointer>;
  }
): ActionContract<TPointer, TInput, TOutput> {
  return { key, mutation, security };
}

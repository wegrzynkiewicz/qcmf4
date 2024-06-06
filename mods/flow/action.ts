import { Breaker } from "../assert/breaker.ts";
import { Provider, ServiceResolver } from "../dependency/service-resolver.ts";
import { Result } from "../useful/result.ts";
import { SecurityPolicyContract } from "./auth.ts";

export type EmptySecurityPointer = Record<never, never>;

export interface ActionContract<TInput, TOutput, TPointer> {
  key: string;
  mutation: boolean;
  security: SecurityPolicyContract<TPointer>;
}
export type UnknownActionContract = ActionContract<unknown, unknown, unknown>;
export type InferAction<T> = T extends ActionContract<infer TInput, infer TOutput, infer TPointer> ? {
  input: TInput;
  output: TOutput;
  pointer: TPointer;
} : never;

export function defineAction<TInput, TOutput, TPointer = EmptySecurityPointer>(
  { key, mutation, security }: {
    key: string;
    mutation: boolean;
    security: SecurityPolicyContract<TPointer>;
  }
): ActionContract<TInput, TOutput, TPointer> {
  return { key, mutation, security };
}

export interface ActionFailure {
  error: string;
  metadata: Record<string, unknown>;
}
export type ActionResult<TOutput> = Result<TOutput, ActionFailure>;

export interface ActionHandler<TActionContract extends UnknownActionContract> {
  handle(
    input: InferAction<TActionContract>["input"],
  ): Promise<ActionResult<InferAction<TActionContract>["output"]>>;
}
export type UnknownActionHandler = ActionHandler<UnknownActionContract>;

export interface ActionHandlerProviderMap extends Map<UnknownActionContract, Provider<UnknownActionHandler>> {
  set<TContract extends UnknownActionContract>(contract: TContract, provider: Provider<ActionHandler<TContract>>): this;
  get<TContract extends UnknownActionContract>(contract: TContract): Provider<ActionHandler<TContract>> | undefined;
}

export function provideActionHandlerProviderMap(): ActionHandlerProviderMap {
  return new Map();
}

export class ActionRunner {
  public constructor(
    private readonly map: ActionHandlerProviderMap,
    private readonly resolver: ServiceResolver,
  ) { }

  public async run<TInput, TOutput, TPointer>(
    contract: ActionContract<TInput, TOutput, TPointer>,
    input: TInput,
    pointer: TPointer,
  ): Promise<ActionResult<TOutput>> {
    const { map, resolver } = this;
    const provider = map.get(contract);
    if (provider === undefined) {
      throw new Breaker('not-found-action-handler-provider', { contractKey: contract.key });
    }
    try {
      const handler = provider(resolver);
      // TODO: run security policy
      const output = await handler.handle(input);
      return output;
    } catch (error: unknown) {
      throw new Breaker('error-inside-action-runner', { contractKey: contract.key, error });
    }
  }
}

export function provideActionRunner(resolver: ServiceResolver) {
  return new ActionRunner(
    resolver.resolve(provideActionHandlerProviderMap),
    resolver,
  );
}

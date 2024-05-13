import { assertRequiredString } from "../assert/asserts.ts";
import { Registry } from "../dependency/registry.ts";
import { InferLayout } from "../layout/defs.ts";
import { UnknownLayout } from "../layout/defs.ts";

export interface ConfigContract<TValue> {
  __?: () => TValue;
  key: string;
  layout: UnknownLayout;
}
export type UnknownConfigContract = ConfigContract<unknown>;

export type InferConfigContract<T> = T extends ConfigContract<infer TValue> ? TValue : never;

export const configContractRegistry = new Registry<UnknownConfigContract>((e) => e.key);

export interface ConfigContractMap extends Map<UnknownConfigContract, unknown> {
  set<T>(contract: ConfigContract<T>, value: T): this;
  get<T>(contract: ConfigContract<T>): T | undefined;
}

export function provideConfigContractRegistry() {
  return configContractRegistry;
}

export function defineConfigContract<TLayout extends UnknownLayout>(
  layout: TLayout,
): ConfigContract<InferLayout<TLayout>> {
  const key = layout.key;
  assertRequiredString(key, "config-contract-key-is-required");
  const contract = { key, layout };
  configContractRegistry.register(contract);
  return contract;
}

export const toEnvVarName = (kind: string): string => {
  const name = kind.replaceAll("-", "_").toLocaleUpperCase();
  const variable = `APP_${name}`;
  return variable;
};

export interface ConfigValueExtractor {
  name: string;
  get(contract: UnknownConfigContract): Promise<unknown>;
}

export interface ConfigValueResult<T> {
  extractor: ConfigValueExtractor;
  value: T;
}
export type UnknownConfigValueResult = ConfigValueResult<unknown>;

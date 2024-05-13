import { assertRequiredString } from "../assert/asserts.ts";
import { Registry } from "../dependency/registry.ts";
import { InferLayout } from "../layout/defs.ts";
import { UnknownLayout } from "../layout/defs.ts";

export interface ConfigEntryDefinition<TValue> {
  __?: () => TValue;
  key: string;
  layout: UnknownLayout;
}
export type UnknownConfigEntryDefinition = ConfigEntryDefinition<unknown>;

export type InferConfigEntryDefinition<TEntry> = TEntry extends ConfigEntryDefinition<infer TValue> ? TValue : never;

export const configEntryRegistry = new Registry<UnknownConfigEntryDefinition>((e) => e.key);

export function provideConfigEntryRegistry() {
  return configEntryRegistry;
}

export function defineConfigEntry<TLayout extends UnknownLayout>(
  layout: TLayout,
): ConfigEntryDefinition<InferLayout<TLayout>> {
  const key = layout.key;
  assertRequiredString(key, "config-entry-key-is-required");
  const entry = { key, layout };
  configEntryRegistry.register(entry);
  return entry;
}

export const toEnvVarName = (kind: string): string => {
  const name = kind.replaceAll("-", "_").toLocaleUpperCase();
  const variable = `APP_${name}`;
  return variable;
};

export interface ConfigEntryExtractor {
  get(entry: UnknownConfigEntryDefinition): Promise<unknown>;
}

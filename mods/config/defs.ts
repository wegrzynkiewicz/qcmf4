import { Registry } from "../dependency/registry.ts";
import { Layout } from "../layout/mod.ts";

export interface ConfigEntryDefinition<TLayout> {
  code: string;
  layout: Layout<TLayout>;
}
export type UnknownConfigEntryDefinition = ConfigEntryDefinition<unknown>;

export type ConfigEntryDefinitionInput<TLayout> = ConfigEntryDefinition<TLayout>;

export const configEntryRegistry = new Registry<UnknownConfigEntryDefinition>((e) => e.code);

export function defineConfigEntry<T>(input: ConfigEntryDefinition<T>): ConfigEntryDefinition<T> {
  const { code, layout } = input;
  const entry = { code, layout };
  configEntryRegistry.register(entry);
  return entry;
}

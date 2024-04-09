import { Registry } from "../dependency/registry.ts";
import { UnknownLayout } from "../layout/mod.ts";

export interface ConfigEntryDefinition<TLayout extends UnknownLayout> {
  kind: string;
  layout: TLayout,
}
export type UnknownConfigEntryDefinition = ConfigEntryDefinition<UnknownLayout>;

export type ConfigEntryDefinitionInput<TLayout extends UnknownLayout> = ConfigEntryDefinition<TLayout>;

export const configEntryRegistry = new Registry<UnknownConfigEntryDefinition>((e) => e.kind);

export function defineConfigEntry<TLayout extends UnknownLayout>(
  input: ConfigEntryDefinition<TLayout>
): ConfigEntryDefinition<TLayout> {
  const { kind, layout } = input;
  const entry = { kind, layout };
  configEntryRegistry.register(entry);
  return entry;
}

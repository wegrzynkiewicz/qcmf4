import { ServiceResolver } from "../dependency/service-resolver.ts";
import { Breaker } from "../assert/breaker.ts";
import { InferLayout } from "../layout/mod.ts";
import { UnknownLayout } from "../layout/mod.ts";
import { LayoutParser, provideLayoutParser } from "../layout/parsing/defs.ts";
import { ConfigEntryDefinition, toEnvVarName } from "./defs.ts";

export class ConfigEntryResolver {
  public constructor(
    private parser: LayoutParser,
  ) { }

  public async resolve<T extends UnknownLayout>(entry: ConfigEntryDefinition<T>): Promise<InferLayout<T>> {
    const { kind, layout } = entry;
    const variable = toEnvVarName(kind)
    const { state } = await Deno.permissions.query({ name: 'env', variable });
    if (state === "granted") {
      const value = Deno.env.get(variable);
      const parsed = this.parser.parse(value, layout);
      return parsed as InferLayout<T>;
    }
    throw new Breaker('cannot-resolve-config-entry', { kind, variable });
  }
}

export function provideConfigEntryResolver(resolver: ServiceResolver) {
  return new ConfigEntryResolver(
    resolver.resolve(provideLayoutParser),
  );
}

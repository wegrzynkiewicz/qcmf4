import { ServiceResolver } from "../dependency/service-resolver.ts";
import { Breaker } from "../assert/breaker.ts";
import { LayoutParser, provideLayoutParser } from "../layout/parsing.ts";
import { ConfigContract, ConfigValueExtractor } from "./defs.ts";
import { formatNegativeLayoutResult } from "../layout/flow.ts";
import { PositiveLayoutResult } from "../layout/flow.ts";
import { provideDenoQueryingConfigValueExtractor } from "./deno-query.ts";
import { provideDenoRequestingConfigValueExtractor } from "./deno-request.ts";
import { provideDotEnvConfigValueExtractor } from "./dotenv.ts";
import { provideBuiltInConfigValueExtractor } from "./built-in.ts";

export class ConfigValueResolver {
  public constructor(
    private parser: LayoutParser,
    private extractors: ConfigValueExtractor[],
  ) {}

  public async resolve<T>(contract: ConfigContract<T>): Promise<T> {
    for (const extractor of this.extractors) {
      const value = await extractor.get(contract);
      if (value === undefined) {
        continue;
      }
      const result = this.parser.parse(value, contract.layout);
      if (PositiveLayoutResult.is(result) === true) {
        return result.value;
      }
      const message = formatNegativeLayoutResult(result);
      throw new Breaker("invalid-config-value-parsing", { message });
    }
    throw new Breaker("undefined-config-value", { contractKey: contract.key });
  }
}

export function provideConfigValueResolver(resolver: ServiceResolver) {
  return new ConfigValueResolver(
    resolver.resolve(provideLayoutParser),
    [
      resolver.resolve(provideDenoQueryingConfigValueExtractor),
      resolver.resolve(provideDotEnvConfigValueExtractor),
      resolver.resolve(provideDenoRequestingConfigValueExtractor),
      resolver.resolve(provideBuiltInConfigValueExtractor ),
    ],
  );
}

import { LayoutTrait } from "../defs.ts";
import { LayoutResult, PositiveLayoutResult } from "../flow.ts";
import { JSONSchema } from "../json-schema-types.ts";
import { WithoutValidatorsLayoutType } from "./without-validation.ts";

export class UnknownLayoutType extends WithoutValidatorsLayoutType<unknown> {
  public parse(value: unknown): LayoutResult<unknown> {
    return new PositiveLayoutResult(value);
  }

  public generateSchema(): JSONSchema {
    return {};
  }
}

export const unknown: LayoutTrait<unknown> = new UnknownLayoutType();

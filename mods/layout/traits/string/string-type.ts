import { LayoutTrait } from "../../defs.ts";
import { LayoutTypeValidator } from "../../validation/defs.ts";
import { AbstractLayoutType, layoutJSONSchemaTypeSymbol } from "../abstract-type.ts";

export class StringLayoutType extends AbstractLayoutType<string> {
  readonly [layoutJSONSchemaTypeSymbol] = "string";
}

export const string = (...validators: LayoutTypeValidator<string>[]): LayoutTrait<string> => {
  return new StringLayoutType(validators);
};

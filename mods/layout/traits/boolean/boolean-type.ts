import { AbstractLayoutType, layoutJSONSchemaTypeSymbol } from "../abstract-type.ts";
import { LayoutTrait } from "../../defs.ts";
import { LayoutTypeValidator } from "../../validation/defs.ts";

export class BooleanLayoutType extends AbstractLayoutType<boolean> {
  readonly [layoutJSONSchemaTypeSymbol] = "boolean";
}

export const boolean = (...validators: LayoutTypeValidator<boolean>[]): LayoutTrait<boolean> => {
  return new BooleanLayoutType(validators);
};

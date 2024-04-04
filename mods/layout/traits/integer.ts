import { LayoutTrait, LayoutTypeValidator } from "../defines.ts";
import { IsNumberLayoutTypeValidator } from "../validators/is-number.ts";
import { AbstractLayoutType, layoutJSONSchemaTypeSymbol } from "./abstract-type.ts";

export class IntegerLayoutType extends AbstractLayoutType<number> {
  readonly [layoutJSONSchemaTypeSymbol] = "integer";
}

export const integer = (...validators: LayoutTypeValidator<number>[]): LayoutTrait<number> => {
  return new IntegerLayoutType([
    new IsNumberLayoutTypeValidator(),
    ...validators,
  ]);
}

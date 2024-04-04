import { LayoutTrait, LayoutTypeValidator } from "../defines.ts";
import { AbstractLayoutType } from "./abstract-type.ts";

export class StringLayoutType extends AbstractLayoutType<string> {
}

export const string = (
  ...validators: LayoutTypeValidator<string>[]
): LayoutTrait<string> => {
  return new StringLayoutType(validators);
}

import { LayoutTrait, LayoutTypeValidator } from "../defines.ts";
import { AbstractLayoutType } from "./abstract-type.ts";

export class DateLayoutType extends AbstractLayoutType<Date> {
}

export const date = (
  ...validators: LayoutTypeValidator<Date>[]
): LayoutTrait<Date> => {
  return new DateLayoutType(validators);
}

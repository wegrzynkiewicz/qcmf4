export type { InferLayout, UnknownLayout } from "./defs.ts";

export { Layout, layout } from "./defs.ts";

export { defaulted } from "./traits/defaulted.ts";
export { description } from "./traits/description.ts";
export { title } from "./traits/title.ts";

export { array } from "./traits/array/array-type.ts";
export { boolean } from "./traits/boolean/boolean-type.ts";
export { constant } from "./traits/constant.ts";
export { date } from "./traits/date.ts";
export { enumerate } from "./traits/enumerate-type.ts";
export { integer } from "./traits/number/integer-type.ts";
export { logical } from "./traits/boolean/logical-type.ts";
export { number } from "./traits/number/number-type.ts";
export { object } from "./traits/object/objects.ts";
export { optional } from "./traits/object/optional.ts";
export { string } from "./traits/string/string-type.ts";

export { greaterThan, greaterThanOrEqual } from "./traits/number/greater-than.ts";
export { lessThan, lessThanOrEqual } from "./traits/number/less-than.ts";
export { minLength } from "./traits/string/min-length.ts";
export { maxLength } from "./traits/string/max-length.ts";
export { minItems } from "./traits/array/min-items.ts";
export { maxItems } from "./traits/array/max-items.ts";
export { uniqueItems } from "./traits/array/unique-items.ts";

export { LayoutJSONSchemaCreator } from "./schema/defs.ts";

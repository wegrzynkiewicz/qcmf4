import { LayoutTrait, layoutTraitSymbol } from "../../defs.ts";
import { layoutSchemaGeneratorSymbol } from "../../schema/defs.ts";
import { JSONSchema } from "../../schema/json-schema-types.ts";

const values = new Map<string | number | boolean | null, boolean>([
  [true, true],
  [false, false],
  ["true", true],
  ["false", false],
  ["TRUE", true],
  ["FALSE", false],
  ["1", true],
  ["0", false],
  [1, true],
  [0, false],
  ["on", true],
  ["off", false],
  ["ON", true],
  ["OFF", false],
  ["yes", true],
  ["no", false],
  ["YES", true],
  ["NO", false],
  ["y", true],
  ["n", false],
  ["Y", true],
  ["N", false],
  ["nil", false],
  ["null", false],
  [null, false],
  ["undefined", false],
  ["[]", false],
  ["", false],
]);

const keys = [...values.keys()];

export class LogicalLayoutType implements LayoutTrait<boolean> {
  readonly [layoutTraitSymbol] = 1;
  [layoutSchemaGeneratorSymbol](): JSONSchema {
    return {
      enum: keys,
    };
  }
}

export const logical = (): LayoutTrait<boolean> => {
  return new LogicalLayoutType();
};

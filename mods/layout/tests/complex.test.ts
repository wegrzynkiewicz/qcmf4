import { assertEquals } from "../../deps.ts";
import { UnknownStructure } from "../../useful/types.ts";
import { InferLayout, layout } from "../defs.ts";
import { formatNegativeLayoutResult, isNegativeLayoutResult } from "../flow.ts";
import { LayoutParser } from "../parsing.ts";
import { LayoutJSONSchemaCreator } from "../schema.ts";
import { array } from "../traits/array/array-type.ts";
import { maxItems } from "../traits/array/max-items.ts";
import { minItems } from "../traits/array/min-items.ts";
import { uniqueItems } from "../traits/array/unique-items.ts";
import { boolean } from "../traits/boolean/boolean-type.ts";
import { constant } from "../traits/constant.ts";
import { date } from "../traits/date.ts";
import { defaulted } from "../traits/defaulted.ts";
import { description } from "../traits/description.ts";
import { enumerate } from "../traits/enumerate-type.ts";
import { greaterThan } from "../traits/number/greater-than.ts";
import { integer } from "../traits/number/integer-type.ts";
import { lessThanOrEqual } from "../traits/number/less-than.ts";
import { number } from "../traits/number/number-type.ts";
import { object } from "../traits/object/objects.ts";
import { optional } from "../traits/object/optional.ts";
import { maxLength } from "../traits/string/max-length.ts";
import { minLength } from "../traits/string/min-length.ts";
import { string } from "../traits/string/string-type.ts";

const testLayout = layout(
  object({
    name: layout(
      description("Name of the person"),
      string(
        minLength(3),
        maxLength(20),
      ),
    ),
    accept: layout(
      constant("ALWAYS"),
    ),
    gender: layout(
      description("Gender of the person"),
      enumerate(
        layout(
          constant("MALE"),
        ),
        layout(
          constant("FEMALE"),
        ),
        layout(
          description("The person does not want to provide their gender"),
          constant("UNKNOWN"),
        ),
      ),
    ),
    age: layout(
      description("Age of the person"),
      integer(
        greaterThan(0),
        lessThanOrEqual(150),
      ),
    ),
    isCompany: layout(boolean()),
    birthDate: layout(date()),
    address: layout(
      object({
        city: layout(string()),
        country: layout(
          string(),
          defaulted(() => "Poland"),
        ),
        street: layout(string()),
        number: layout(number(), optional),
      }),
    ),
    hobbies: layout(
      array(
        layout(string()),
        minItems(1),
        maxItems(5),
        uniqueItems(),
      ),
    ),
  }),
);
type TestLayoutType = InferLayout<typeof testLayout>;

Deno.test("validate complex example", () => {
  const testInstance: TestLayoutType = {
    age: 4,
    name: "test",
    accept: "ALWAYS",
    gender: "FEMALE",
    birthDate: new Date(),
    isCompany: true,
    address: {
      city: "city",
      country: "Poland",
      street: "street",
      number: 4,
    },
    hobbies: ["js", "ts", "deno"],
  };
});

Deno.test("complex example json schema creation", () => {
  const creator = new LayoutJSONSchemaCreator();
  const jsonSchema = creator.create(testLayout);
  assertEquals(jsonSchema, {
    type: "object",
    properties: {
      accept: {
        const: "ALWAYS",
      },
      gender: {
        description: "Gender of the person",
        oneOf: [
          {
            const: "MALE",
          },
          {
            const: "FEMALE",
          },
          {
            description: "The person does not want to provide their gender",
            const: "UNKNOWN",
          },
        ],
      },
      name: {
        description: "Name of the person",
        type: "string",
        minLength: 3,
        maxLength: 20,
      },
      age: {
        description: "Age of the person",
        exclusiveMaximum: 150,
        exclusiveMinimum: 0,
        type: "integer",
      },
      isCompany: {
        type: "boolean",
      },
      birthDate: { type: "string", format: "date-time" },
      address: {
        type: "object",
        properties: {
          city: { type: "string" },
          country: { type: "string", default: "Poland" },
          street: { type: "string" },
          number: { type: "number" },
        },
        required: ["city", "street"],
      },
      hobbies: {
        type: "array",
        items: { type: "string" },
        maxItems: 5,
        minItems: 1,
        uniqueItems: true,
      },
    },
    required: [
      "name",
      "accept",
      "gender",
      "age",
      "isCompany",
      "birthDate",
      "address",
      "hobbies",
    ],
  });
});

Deno.test("complex example validation", () => {
  const testInstance: UnknownStructure<TestLayoutType> = {
    age: 160,
    name: "te",
    accept: "ALWAYS",
    hobbies: ["js", "js"],
    address: {
      country: 123,
    },
  };
  const parser = new LayoutParser();
  const result = parser.parse(testInstance, testLayout);
  if (isNegativeLayoutResult(result)) {
    console.log(formatNegativeLayoutResult(result));
  }
});

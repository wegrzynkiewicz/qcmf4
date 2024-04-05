import { assertEquals } from "../../deps.ts";
import { defaulted } from "../mod.ts";
import {
  array,
  boolean,
  date,
  description,
  greaterThan,
  InferLayout,
  integer,
  layout,
  LayoutJSONSchemaCreator,
  lessThanOrEqual,
  maxItems,
  maxLength,
  minItems,
  minLength,
  number,
  object,
  optional,
  string,
  uniqueItems,
} from "../mod.ts";

const testLayout = layout(
  object({
    name: layout(
      description("Name of the person"),
      string(
        minLength(3),
        maxLength(20),
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
    required: ["name", "age", "isCompany", "birthDate", "address", "hobbies"],
  });
});

import { assertEquals } from "../../deps.ts";
import { array, date, description, InferLayout, integer, layout, maxItems, minItems, number, object, optional, string } from "../mod.ts";
import { LayoutJSONSchemaCreator } from "../schema/defines.ts";
import { uniqueItems } from "../traits/array/unique-items.ts";
import { greaterThan } from "../traits/number/greater-than.ts";
import { lessThanOrEqual } from "../traits/number/less-than.ts";
import { maxLength } from "../traits/string/max-length.ts";
import { minLength } from "../traits/string/min-length.ts";

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
    birthDate: layout(date()),
    address: layout(
      object({
        city: layout(string()),
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
    address: {
      city: "city",
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
      birthDate: { type: "string", format: "date-time" },
      address: {
        type: "object",
        properties: {
          city: { type: "string" },
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
    required: ["name", "age", "birthDate", "address", "hobbies"],
  });
});

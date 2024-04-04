import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { array, date, InferLayout, integer, layout, number, object, optional, string } from "../mod.ts";
import { JSONSchemaCreator } from "../schema/create.ts";

const testLayout = layout(
  object({
    name: layout(string()),
    age: layout(integer()),
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
  const creator = new JSONSchemaCreator();
  const jsonSchema = creator.create(testLayout);
  assertEquals(jsonSchema, {
    type: "object",
    properties: {
      name: { type: "string" },
      age: { type: "integer" },
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
      },
    },
    required: ["name", "age", "birthDate", "address", "hobbies"],
  });
});

import { description, InferLayout, layout, number, string } from "../mod.ts";

const testLayout = layout(
  description("test"),
  string(),
  number(),
);
type TestType = InferLayout<typeof testLayout>;

Deno.test("validate basic test", () => {
});

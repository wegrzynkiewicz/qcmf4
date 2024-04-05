import { description, InferLayout, layout, string } from "../mod.ts";

const testLayout = layout(
  description("test"),
  string(),
);
type TestType = InferLayout<typeof testLayout>;

Deno.test("validate basic test", () => {
});

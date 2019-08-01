import Env from "./Env";

test("Should correctly set and get value", () => {
  const env = new Env();
  env.set("foo", "bar");
  expect(env.get("foo")).toBe("bar");
});

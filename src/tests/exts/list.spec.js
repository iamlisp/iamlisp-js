import createEvaluator from "../../createEvaluator";

let evaluate;

beforeEach(() => {
  evaluate = createEvaluator({});
});

describe("chunk", () => {
  test("chunk #0", () => {
    const result = evaluate(`(import "list") (chunk Nil 3)`);
    expect(result).toEqual("Nil");
  });

  test("chunk #1", () => {
    const result = evaluate(`(import "list") (chunk (list 1 2 3 4 5 6) 3)`);
    expect(result).toEqual("((1 2 3) (4 5 6))");
  });

  test("chunk #2", () => {
    const result = evaluate(`(import "list") (chunk (list 1 2 3 4 5) 3)`);
    expect(result).toEqual("((1 2 3) (4 5))");
  });
});

import evaluationHints from "./evaluationHints";

const labels = text => evaluationHints(text).map(hint => hint.label);

describe("evaluation hints", () => {
  test("evaluates primitives, variables, and functions", () => {
    expect(
      labels("(def x 5)\n(defun square (n) (* n n))\n(square x)")
    ).toEqual([" => undefined", " => undefined", " => 25"]);
  });

  test("evaluates side-effecting and JavaScript interop expressions", () => {
    expect(labels('(print "hello")\n(.toUpperCase "hello")')).toEqual([
      " => undefined",
      ' => "HELLO"'
    ]);
  });

  test("evaluates recursive functions without a language-server limit", () => {
    expect(
      labels(`(defun factorial (n)
        (if (= n 0) 1 (* n (factorial (- n 1)))))
      (factorial 10)`)
    ).toEqual([" => undefined", " => 3628800"]);
  });

  test("evaluates layout document prefixes", () => {
    expect(
      labels(`#!iamlisp layout-v1
def x 40
+ x 2`)
    ).toEqual([" => undefined", " => 42"]);
  });

  test("skips incomplete and invalid prefixes", () => {
    expect(labels("(+ 1\n  2)")).toEqual([" => 3"]);
  });

  test("honors requested line range", () => {
    expect(
      evaluationHints("(+ 1 2)\n(+ 3 4)", {
        start: { line: 1, character: 0 },
        end: { line: 1, character: 7 }
      }).map(hint => hint.label)
    ).toEqual([" => 7"]);
  });
});

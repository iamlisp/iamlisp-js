import evaluationHints from "./evaluationHints";

const labels = text => evaluationHints(text).map(hint => hint.label);

describe("evaluation hints", () => {
  test("evaluates primitives, variables, and functions", () => {
    expect(
      labels("(def x 5)\n(defun square (n) (* n n))\n(square x)")
    ).toEqual([" => 25"]);
  });

  test("evaluates side-effecting and JavaScript interop expressions", () => {
    expect(labels('(print "hello")\n(.toUpperCase "hello")')).toEqual([
      ' => "HELLO"'
    ]);
  });

  test("evaluates recursive functions without a language-server limit", () => {
    expect(
      labels(`(defun factorial (n)
        (if (= n 0) 1 (* n (factorial (- n 1)))))
      (factorial 10)`)
    ).toEqual([" => 3628800"]);
  });

  test("evaluates layout document prefixes", () => {
    expect(
      labels(`#!iamlisp layout-v1
def x 40
+ x 2`)
    ).toEqual([" => 42"]);
  });

  test("shows hints only after complete multiline layout expressions", () => {
    expect(
      evaluationHints(`#!iamlisp layout-v1
import "stream"

def fibsexp
  cons 0
    cons 1
      zipwith +
        cdr fibsexp
        => fibsexp

to-list
  take 10 fibsexp`).map(hint => ({
        line: hint.position.line,
        label: hint.label
      }))
    ).toEqual([
      {
        line: 11,
        label: " => (0 1 1 2 3 5 8 13 21 34)"
      }
    ]);
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

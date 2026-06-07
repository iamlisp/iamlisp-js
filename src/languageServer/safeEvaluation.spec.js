import { parseBracketSyntax } from "../parser/parse";
import { safeEvaluate, safeEvaluationHints } from "./safeEvaluation";

const expression = source => parseBracketSyntax(source)[0];

describe("safe evaluation hints", () => {
  test("evaluates literal-only primitive expressions", () => {
    expect(safeEvaluate(expression("(+ 1 (* 2 3))"))).toEqual({
      safe: true,
      value: 7
    });
    expect(safeEvaluate(expression("(and (> 3 2) (not false))"))).toEqual({
      safe: true,
      value: true
    });
  });

  test.each(["(+ value 1)", "(print 1)", "(def value 1)", "(.toString 1)", "'(+ 1 2)"])(
    "does not evaluate unsafe expression %s",
    source => {
    expect(safeEvaluate(expression(source)).safe).toBe(false);
    }
  );

  test("creates hints for bracket and layout syntax", () => {
    expect(safeEvaluationHints("(+ 1 (* 2 3))")[0].label).toBe(" => 7");
    expect(
      safeEvaluationHints("#!iamlisp layout-v1\n+ 1 (* 2 3)")[0].label
    ).toBe(" => 7");
  });

  test("evaluates document-local variables", () => {
    const hints = safeEvaluationHints("(def x 40)\n(+ x 2)");
    expect(hints.map(hint => hint.label)).toEqual([" => 42"]);
  });

  test("evaluates multi-binding defs and respects definition order", () => {
    const hints = safeEvaluationHints("(+ x 1)\n(def x 20 y (+ x 1))\n(+ x y)");
    expect(hints.map(hint => hint.label)).toEqual([" => 41"]);
  });

  test("evaluates pure document-local functions", () => {
    const hints = safeEvaluationHints(
      "(defun square (x) (* x x))\n(square (+ 2 3))"
    );
    expect(hints.map(hint => hint.label)).toEqual([" => 25"]);
  });

  test("evaluates layout functions and recursion within step limit", () => {
    const hints = safeEvaluationHints(`#!iamlisp layout-v1
defun factorial (n)
  if (= n 0) 1 (* n (factorial (- n 1)))
factorial 5`);
    expect(hints.map(hint => hint.label)).toEqual([" => 120"]);
  });

  test("evaluates pure cond functions", () => {
    const hints = safeEvaluationHints(`(defun fib (n)
      (cond
        ((<= n 1) n)
        (else (+ (fib (- n 1)) (fib (- n 2))))))
      (fib 10)`);
    expect(hints.map(hint => hint.label)).toEqual([" => 55"]);
  });

  test("skips functions that call unsafe forms", () => {
    const hints = safeEvaluationHints(
      "(defun noisy (x) (print x) (+ x 1))\n(noisy 2)"
    );
    expect(hints).toEqual([]);
  });

  test("stops unbounded recursion", () => {
    const hints = safeEvaluationHints(
      "(defun forever (x) (forever x))\n(forever 1)"
    );
    expect(hints).toEqual([]);
  });
});

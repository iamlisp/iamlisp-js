import createEvaluator from "../createEvaluator";

const programs = [
  "(+ 1 (* 2 3) (- 10 4))",
  "(sqrt 9)",
  "(sqrt 9 4)",
  "(and true 1)",
  "(or false 42)",
  "(cond ((> 1 2) 10) ((< 1 2) 20) (else 30))",
  "(begin (def x 10) (def y 20) (+ x y))",
  "(import \"list\") (map #(* % %) (until 1 6))",
  "(defun fib (n) (cond ((<= n 1) n) ((+ (fib (- n 1)) (fib (- n 2)))))) (fib 10)"
];

describe("iterative evaluator", () => {
  test.each(programs)("matches recursive evaluator for %s", program => {
    const recursive = createEvaluator({ mode: "recursive" });
    const iterative = createEvaluator({ mode: "iterative" });

    expect(iterative(program)).toEqual(recursive(program));
  });

  test("evaluates deep non-tail recursion without overflowing JS stack", () => {
    const evaluate = createEvaluator({ timeout: 30000 });
    const result = evaluate(`
      (defun count-up (n)
        (cond ((zero? n) 0)
              ((+ 1 (count-up (dec n))))))
      (count-up 20000)
    `);

    expect(result).toEqual(20000);
  });

  test("is the default evaluator", () => {
    const evaluate = createEvaluator({ timeout: 30000 });
    const result = evaluate(`
      (defun count-up (n)
        (cond ((zero? n) 0)
              ((+ 1 (count-up (dec n))))))
      (count-up 20000)
    `);

    expect(result).toEqual(20000);
  });
});

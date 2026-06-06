import parse from "./parse";
import createEvaluator from "../createEvaluator";

describe("layout-v1", () => {
  test("parses to the same tree as bracket syntax", () => {
    const layout = `#!iamlisp layout-v1
defun fib (n)
\tcond
\t\t(<= n 1) n
\t\telse
\t\t\t+ (fib (- n 1)) (fib (- n 2))
fib 10`;
    const bracket = `
      (defun fib (n)
        (cond
          ((<= n 1) n)
          (else
            (+ (fib (- n 1)) (fib (- n 2))))))
      (fib 10)
    `;

    expect(parse(layout)).toEqual(parse(bracket));
  });

  test("supports raw scalar expressions with =>", () => {
    const evaluate = createEvaluator();
    const result = evaluate(`#!iamlisp layout-v1
defun sign (n)
\tcond
\t\t(zero? n)
\t\t\t=> "zero"
\t\telse
\t\t\t=> "nonzero"
sign 0`);

    expect(result).toEqual('"zero"');
  });

  test("ignores blank lines and comments", () => {
    const evaluate = createEvaluator();
    const result = evaluate(`#!iamlisp layout-v1
; comment

def x 20 ; inline comment
+ x 22`);

    expect(result).toEqual(42);
  });

  test("uses relative indentation instead of fixed widths", () => {
    const layout = `#!iamlisp layout-v1
defun fib (n)
  cond
       (<= n 1) n
       else
          + (fib (- n 1)) (fib (- n 2))
fib 10`;

    expect(createEvaluator()(layout)).toEqual(55);
  });

  test("allows tabs and spaces in the same program", () => {
    const layout = `#!iamlisp layout-v1
defun answer ()
\tbegin
\t  => 42
answer`;

    expect(createEvaluator()(layout)).toEqual(42);
  });

  test.each([
    ["indented first expression", "#!iamlisp layout-v1\n  def x 1", 2],
    [
      "unknown dedent width",
      "#!iamlisp layout-v1\ndef x\n    + 1 2\n  + 3 4",
      4
    ],
    ["nested raw expression", "#!iamlisp layout-v1\ndef x\n\t=> 1\n\t\t+ 1 2", 3]
  ])("rejects %s", (name, program, lineNumber) => {
    expect(() => parse(program)).toThrow(
      `Layout syntax error at line ${lineNumber}`
    );
  });
});

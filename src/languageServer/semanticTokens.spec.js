import { semanticTokenEntries } from "./semanticTokens";

const tokens = text =>
  semanticTokenEntries(text).map(({ text: value, type, modifiers }) => ({
    value,
    type,
    declaration: Boolean(modifiers & 1)
  }));

describe("semantic tokens", () => {
  test("classifies every multi-variable def binding", () => {
    expect(tokens("(def x 10 y (+ x 10) z 30)")).toEqual([
      { value: "def", type: "keyword", declaration: false },
      { value: "x", type: "variable", declaration: true },
      { value: "10", type: "number", declaration: false },
      { value: "y", type: "variable", declaration: true },
      { value: "+", type: "operator", declaration: false },
      { value: "x", type: "variable", declaration: false },
      { value: "10", type: "number", declaration: false },
      { value: "z", type: "variable", declaration: true },
      { value: "30", type: "number", declaration: false }
    ]);
  });

  test("classifies functions, parameters, and references", () => {
    expect(tokens("(defun square (n) (* n n))\n(square 5)")).toEqual([
      { value: "defun", type: "keyword", declaration: false },
      { value: "square", type: "function", declaration: true },
      { value: "n", type: "parameter", declaration: true },
      { value: "*", type: "operator", declaration: false },
      { value: "n", type: "parameter", declaration: false },
      { value: "n", type: "parameter", declaration: false },
      { value: "square", type: "function", declaration: false },
      { value: "5", type: "number", declaration: false }
    ]);
  });

  test("classifies multiline bracket function headers", () => {
    expect(tokens("(defun add (x y)\n  (+ x y))")).toEqual(
      expect.arrayContaining([
        { value: "add", type: "function", declaration: true },
        { value: "x", type: "parameter", declaration: true },
        { value: "y", type: "parameter", declaration: true },
        { value: "x", type: "parameter", declaration: false },
        { value: "y", type: "parameter", declaration: false }
      ])
    );
  });

  test("supports layout definitions, strings, and comments", () => {
    expect(tokens('#!iamlisp layout-v1\ndef x 1 y 2\n; note\n+ x y "ok"')).toEqual(
      expect.arrayContaining([
        { value: "x", type: "variable", declaration: true },
        { value: "y", type: "variable", declaration: true },
        { value: "; note", type: "comment", declaration: false },
        { value: '"ok"', type: "string", declaration: false }
      ])
    );
  });
});

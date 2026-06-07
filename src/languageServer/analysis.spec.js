import {
  completionItems,
  findDocumentSymbols,
  hoverForWord,
  validateDocument,
  wordAt
} from "./analysis";

describe("language server analysis", () => {
  test("validates bracket and layout programs", () => {
    expect(validateDocument("(+ 1 2)")).toEqual([]);
    expect(
      validateDocument("#!iamlisp layout-v1\ndefun square (x)\n  * x x")
    ).toEqual([]);
    expect(validateDocument("(+ 1 2")).toHaveLength(1);
  });

  test("finds bracket and layout definitions", () => {
    const symbols = findDocumentSymbols(
      "(def answer 42)\n(defun square (x) (* x x))\ndefmacro when (x)\ndef value 10"
    );

    expect(symbols.map(symbol => symbol.name)).toEqual([
      "answer",
      "square",
      "when",
      "value"
    ]);
  });

  test("provides completions and hover", () => {
    expect(completionItems().some(item => item.label === "defun")).toBeTruthy();
    expect(hoverForWord("loop")).not.toBeNull();
    expect(hoverForWord("unknown")).toBeNull();
  });

  test("finds word at a position", () => {
    expect(wordAt("(defun square (x)", { line: 0, character: 3 })).toBe(
      "defun"
    );
  });
});

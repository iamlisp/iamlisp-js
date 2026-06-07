import createEvaluator from "../createEvaluator";

function isCodeLine(line) {
  const source = line.trim();
  return source && !source.startsWith(";") && !source.startsWith("#!");
}

function isLayoutProgram(lines) {
  return lines[0]?.replace(/^\uFEFF/, "") === "#!iamlisp layout-v1";
}

function layoutExpressionEndLines(lines) {
  const roots = lines.flatMap((line, lineNumber) =>
    isCodeLine(line) && !/^[\t ]/.test(line) ? [lineNumber] : []
  );

  return new Set(
    roots.map((root, index) => {
      const nextRoot = roots[index + 1] ?? lines.length;
      for (let lineNumber = nextRoot - 1; lineNumber >= root; lineNumber -= 1) {
        if (isCodeLine(lines[lineNumber])) {
          return lineNumber;
        }
      }
      return root;
    })
  );
}

export default function evaluationHints(text, range, options = {}) {
  const lines = text.split(/\r?\n/);
  const startLine = range?.start?.line || 0;
  const endLine = range?.end?.line ?? lines.length - 1;
  const create = options.createEvaluator || createEvaluator;
  const layoutEndLines = isLayoutProgram(lines)
    ? layoutExpressionEndLines(lines)
    : null;

  return lines.flatMap((line, lineNumber) => {
    if (
      lineNumber < startLine ||
      lineNumber > endLine ||
      !isCodeLine(line) ||
      (layoutEndLines && !layoutEndLines.has(lineNumber))
    ) {
      return [];
    }

    try {
      const evaluate = create({ printFn: () => {} });
      const result = evaluate(lines.slice(0, lineNumber + 1).join("\n"));
      if (result === undefined) {
        return [];
      }
      return [
        {
          position: { line: lineNumber, character: line.length },
          label: ` => ${String(result)}`,
          paddingLeft: true
        }
      ];
    } catch {
      return [];
    }
  });
}

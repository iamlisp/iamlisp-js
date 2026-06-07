import createEvaluator from "../createEvaluator";

function isCodeLine(line) {
  const source = line.trim();
  return source && !source.startsWith(";") && !source.startsWith("#!");
}

export default function evaluationHints(text, range, options = {}) {
  const lines = text.split(/\r?\n/);
  const startLine = range?.start?.line || 0;
  const endLine = range?.end?.line ?? lines.length - 1;
  const create = options.createEvaluator || createEvaluator;

  return lines.flatMap((line, lineNumber) => {
    if (
      lineNumber < startLine ||
      lineNumber > endLine ||
      !isCodeLine(line)
    ) {
      return [];
    }

    try {
      const evaluate = create({ printFn: () => {} });
      const result = evaluate(lines.slice(0, lineNumber + 1).join("\n"));
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

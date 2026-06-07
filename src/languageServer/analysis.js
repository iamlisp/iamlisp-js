import parse from "../parser/parse";
import { completionNames, languageForms, operators } from "./languageData";

const definitionPattern =
  /^(?:\s*\(\s*|\s*)(defun|defmacro|defmulti|def)\s+([^\s()[\]{};]+)/;

export function validateDocument(text) {
  try {
    parse(text);
    return [];
  } catch (error) {
    const lineMatch = error.message.match(/line (\d+)/);
    const line = Math.max(0, Number(lineMatch?.[1] || 1) - 1);

    return [
      {
        severity: 1,
        range: {
          start: { line, character: 0 },
          end: { line, character: 1000 }
        },
        message: error.message,
        source: "iamlisp"
      }
    ];
  }
}

export function findDocumentSymbols(text) {
  return text.split(/\r?\n/).flatMap((line, lineNumber) => {
    const match = line.match(definitionPattern);
    if (!match) {
      return [];
    }

    const [, form, name] = match;
    const start = line.indexOf(name);
    return [
      {
        name,
        kind: form === "def" ? 13 : 12,
        range: {
          start: { line: lineNumber, character: start },
          end: { line: lineNumber, character: start + name.length }
        },
        selectionRange: {
          start: { line: lineNumber, character: start },
          end: { line: lineNumber, character: start + name.length }
        }
      }
    ];
  });
}

export function completionItems() {
  return completionNames.map(name => ({
    label: name,
    kind: operators.includes(name) ? 24 : 3,
    detail: languageForms[name] || "iamlisp symbol"
  }));
}

export function hoverForWord(word) {
  const description = languageForms[word];
  if (!description && !operators.includes(word)) {
    return null;
  }

  return {
    contents: {
      kind: "markdown",
      value: `**${word}**\n\n${description || "Built-in iamlisp operator."}`
    }
  };
}

export function wordAt(text, position) {
  const line = text.split(/\r?\n/)[position.line] || "";
  const isSymbolChar = char => char && !/[\s()[\]{};'"]/.test(char);
  let start = position.character;
  let end = position.character;

  while (start > 0 && isSymbolChar(line[start - 1])) {
    start -= 1;
  }
  while (end < line.length && isSymbolChar(line[end])) {
    end += 1;
  }

  return line.slice(start, end);
}

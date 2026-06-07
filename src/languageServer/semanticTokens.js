import { SemanticTokensBuilder } from "vscode-languageserver/node";
import { parseBracketSyntax } from "../parser/parse";
import Symbl from "../types/Symbl";
import { languageForms, operators } from "./languageData";

export const tokenTypes = [
  "variable",
  "function",
  "parameter",
  "keyword",
  "operator",
  "number",
  "string",
  "comment"
];
export const tokenModifiers = ["declaration", "readonly"];

const typeIndex = Object.fromEntries(tokenTypes.map((type, index) => [type, index]));
const modifierBits = {
  declaration: 1 << tokenModifiers.indexOf("declaration"),
  readonly: 1 << tokenModifiers.indexOf("readonly")
};
const functionForms = new Set(["defun", "defmacro", "defmulti", "defmethod"]);
const keywordForms = new Set(Object.keys(languageForms));
const operatorForms = new Set(operators);

function scanLine(line, lineNumber) {
  const tokens = [];
  let index = 0;
  let depth = 0;

  while (index < line.length) {
    const char = line[index];
    if (char === ";") {
      tokens.push({
        line: lineNumber,
        start: index,
        length: line.length - index,
        text: line.slice(index),
        kind: "comment",
        depth
      });
      break;
    }
    if (char === '"') {
      let end = index + 1;
      while (end < line.length) {
        if (line[end] === "\\") {
          end += 2;
        } else if (line[end++] === '"') {
          break;
        }
      }
      tokens.push({
        line: lineNumber,
        start: index,
        length: end - index,
        text: line.slice(index, end),
        kind: "string",
        depth
      });
      index = end;
      continue;
    }
    if ("([{".includes(char)) {
      depth += 1;
      index += 1;
      continue;
    }
    if (")]}".includes(char)) {
      depth = Math.max(0, depth - 1);
      index += 1;
      continue;
    }
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    const start = index;
    while (
      index < line.length &&
      !/[\s()[\]{};"]/.test(line[index])
    ) {
      index += 1;
    }
    tokens.push({
      line: lineNumber,
      start,
      length: index - start,
      text: line.slice(start, index),
      kind: "symbol",
      depth
    });
  }

  tokens.source = line;
  return tokens;
}

function codeTokens(tokens) {
  return tokens.filter(token => token.kind === "symbol");
}

function topLevelForm(tokens) {
  const symbols = codeTokens(tokens);
  if (symbols.length === 0) {
    return { symbols, form: undefined, depth: 0 };
  }
  const depth = Math.min(...symbols.map(token => token.depth));
  return {
    symbols,
    form: symbols.find(token => token.depth === depth)?.text,
    depth
  };
}

function declarationKey(token) {
  return `${token.line}:${token.start}`;
}

function symbolName(value) {
  return value instanceof Symbl ? value.name : undefined;
}

function parseDefinitionLine(tokens) {
  try {
    const parsed = parseBracketSyntax(tokens.source.trim());
    return tokens.source.trimStart().startsWith("(") ? parsed[0] : parsed;
  } catch {
    const match = tokens.source.match(
      /^\s*\(\s*(defun|defmacro|defmulti|defmethod)\s+([^\s()[\]{};]+)\s+\(([^)]*)\)/
    );
    if (!match) {
      return null;
    }
    return [
      new Symbl(match[1]),
      new Symbl(match[2]),
      match[3]
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(name => new Symbl(name))
    ];
  }
}

function declarationTokens(tokens, names, afterStart = -1) {
  const available = codeTokens(tokens).filter(token => token.start > afterStart);
  const found = [];

  for (const name of names) {
    const token = available.find(
      candidate =>
        candidate.text === name && !found.includes(candidate)
    );
    if (token) {
      found.push(token);
    }
  }
  return found;
}

function collectDeclarations(lines) {
  const declarations = new Map();
  const variables = new Set();
  const functions = new Set();
  const parameters = new Set();

  for (const tokens of lines) {
    const { symbols, form } = topLevelForm(tokens);
    const definition = parseDefinitionLine(tokens);

    if (form === "def" && Array.isArray(definition)) {
      const names = definition
        .slice(1)
        .filter((value, index) => index % 2 === 0)
        .map(symbolName)
        .filter(Boolean);
      declarationTokens(tokens, names).forEach(token => {
        declarations.set(declarationKey(token), "variable");
        variables.add(token.text);
      });
    } else if (functionForms.has(form) && Array.isArray(definition)) {
      const name = symbolName(definition[1]);
      const nameToken = symbols.find(token => token.text === name);
      if (!nameToken) {
        continue;
      }
      declarations.set(declarationKey(nameToken), "function");
      functions.add(name);

      const names = Array.isArray(definition[2])
        ? definition[2].map(symbolName).filter(Boolean)
        : [];
      declarationTokens(tokens, names, nameToken.start).forEach(token => {
        declarations.set(declarationKey(token), "parameter");
        parameters.add(token.text);
      });
    }
  }

  return { declarations, variables, functions, parameters };
}

function classify(token, context) {
  if (token.kind === "comment" || token.kind === "string") {
    return { type: token.kind, modifiers: 0 };
  }
  if (/^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(token.text)) {
    return { type: "number", modifiers: 0 };
  }

  const declaration = context.declarations.get(declarationKey(token));
  if (declaration) {
    return {
      type: declaration,
      modifiers: modifierBits.declaration | modifierBits.readonly
    };
  }
  if (operatorForms.has(token.text)) {
    return { type: "operator", modifiers: 0 };
  }
  if (keywordForms.has(token.text) || ["else", "true", "false", "null", "undefined"].includes(token.text)) {
    return { type: "keyword", modifiers: 0 };
  }
  if (context.functions.has(token.text)) {
    return { type: "function", modifiers: 0 };
  }
  if (context.parameters.has(token.text)) {
    return { type: "parameter", modifiers: 0 };
  }
  if (context.variables.has(token.text)) {
    return { type: "variable", modifiers: 0 };
  }
  return null;
}

export function semanticTokenEntries(text) {
  const lines = text.split(/\r?\n/).map(scanLine);
  const context = collectDeclarations(lines);

  return lines.flatMap(tokens =>
    tokens.flatMap(token => {
      const classification = classify(token, context);
      return classification ? [{ ...token, ...classification }] : [];
    })
  );
}

export default function semanticTokens(text) {
  const builder = new SemanticTokensBuilder();
  semanticTokenEntries(text).forEach(token => {
    builder.push(
      token.line,
      token.start,
      token.length,
      typeIndex[token.type],
      token.modifiers
    );
  });
  return builder.build();
}

import parse, { parseBracketSyntax } from "../parser/parse";
import print from "../printer/print";
import Symbl from "../types/Symbl";

const unsafe = () => ({ safe: false });
const safe = value => ({ safe: true, value });
const maxSteps = 10000;

const operators = {
  "+": values => values.reduce((left, right) => left + right),
  "-": values =>
    values.length === 1
      ? -values[0]
      : values.reduce((left, right) => left - right),
  "*": values => values.reduce((left, right) => left * right),
  "/": values => values.reduce((left, right) => left / right),
  "//": values => values.reduce((left, right) => Math.floor(left / right)),
  "%": values => values.reduce((left, right) => left % right),
  pow: values => values.reduce((left, right) => Math.pow(left, right)),
  sqrt: values => values.reduce((left, right) => Math.sqrt(left, right)),
  max: values => values.reduce((left, right) => Math.max(left, right)),
  min: values => values.reduce((left, right) => Math.min(left, right)),
  ">": values => compare(values, (left, right) => left > right),
  "<": values => compare(values, (left, right) => left < right),
  ">=": values => compare(values, (left, right) => left >= right),
  "<=": values => compare(values, (left, right) => left <= right),
  "=": values => compare(values, (left, right) => left === right),
  "!=": values => compare(values, (left, right) => left !== right),
  and: values => values.every(Boolean),
  or: values => values.find(Boolean) || false,
  not: values => !values[0]
};

function compare(values, predicate) {
  return values.slice(1).every((value, index) => predicate(values[index], value));
}

function symbolName(value) {
  return value instanceof Symbl ? value.name : undefined;
}

function evaluateSequence(expressions, env, state) {
  let result = safe(undefined);
  for (const expression of expressions) {
    result = safeEvaluate(expression, env, state);
    if (!result.safe) {
      return result;
    }
  }
  return result;
}

function callPureFunction(fn, args, state) {
  if (args.length !== fn.params.length) {
    return unsafe();
  }

  const localEnv = new Map(fn.env);
  fn.params.forEach((name, index) => localEnv.set(name, args[index]));
  return evaluateSequence(fn.body, localEnv, state);
}

function evaluateCond(pairs, env, state) {
  for (const pair of pairs) {
    if (!Array.isArray(pair) || pair.length === 0) {
      return unsafe();
    }
    if (symbolName(pair[0]) === "else") {
      return safeEvaluate(pair[1], env, state);
    }

    const condition = safeEvaluate(pair[0], env, state);
    if (!condition.safe) {
      return unsafe();
    }
    if (condition.value) {
      return pair.length === 1
        ? condition
        : safeEvaluate(pair[1], env, state);
    }
  }
  return safe(undefined);
}

function evaluateCall(expression, env, state) {
  const name = symbolName(expression[0]);
  if (!name) {
    return unsafe();
  }

  if (name === "if") {
    const condition = safeEvaluate(expression[1], env, state);
    return condition.safe
      ? safeEvaluate(expression[condition.value ? 2 : 3], env, state)
      : unsafe();
  }
  if (name === "begin") {
    return evaluateSequence(expression.slice(1), env, state);
  }
  if (name === "cond") {
    return evaluateCond(expression.slice(1), env, state);
  }

  const evaluated = expression.slice(1).map(value =>
    safeEvaluate(value, env, state)
  );
  if (evaluated.some(result => !result.safe)) {
    return unsafe();
  }
  const values = evaluated.map(result => result.value);

  if (operators[name]) {
    return safe(operators[name](values));
  }

  const fn = env.get(name);
  return fn?.type === "pure-function"
    ? callPureFunction(fn, values, state)
    : unsafe();
}

function safeEvaluate(expression, env = new Map(), state = { steps: 0 }) {
  state.steps += 1;
  if (state.steps > maxSteps) {
    return unsafe();
  }

  if (!Array.isArray(expression)) {
    if (expression instanceof Symbl) {
      return env.has(expression.name) ? safe(env.get(expression.name)) : unsafe();
    }
    return safe(expression);
  }

  try {
    return evaluateCall(expression, env, state);
  } catch {
    return unsafe();
  }
}

function documentDefinitions(text) {
  const expressions = parse(text).filter(expression =>
    ["def", "defun"].includes(symbolName(expression?.[0]))
  );
  const lines = text.split(/\r?\n/).flatMap((line, lineNumber) =>
    /^(?:\s*\(\s*|\s*)(?:defun|def)\s+[^\s()[\]{};]+/.test(line)
      ? [lineNumber]
      : []
  );

  return expressions.map((expression, index) => ({
    expression,
    line: lines[index] ?? Number.MAX_SAFE_INTEGER
  }));
}

function buildDocumentEnv(definitions, lineNumber) {
  const env = new Map();

  for (const { expression, line } of definitions) {
    if (line > lineNumber) {
      continue;
    }

    const form = symbolName(expression?.[0]);
    const name = symbolName(expression?.[1]);
    if (form === "def") {
      for (let index = 1; index < expression.length - 1; index += 2) {
        const variableName = symbolName(expression[index]);
        const result = safeEvaluate(expression[index + 1], env);
        if (variableName && result.safe) {
          env.set(variableName, result.value);
        }
      }
    } else if (
      form === "defun" &&
      name &&
      Array.isArray(expression[2]) &&
      expression[2].every(param => param instanceof Symbl)
    ) {
      env.set(name, {
        type: "pure-function",
        params: expression[2].map(param => param.name),
        body: expression.slice(3),
        env
      });
    }
  }

  return env;
}

function expressionForLine(line, layout) {
  const source = line.trim();
  if (!source || source.startsWith(";") || source.startsWith("#!")) {
    return undefined;
  }

  const raw = source.startsWith("=>");
  const parsed = parseBracketSyntax(raw ? source.slice(2).trimStart() : source)
    .filter(expression => expression !== undefined);

  if (layout && !raw) {
    return parsed;
  }
  return parsed.length === 1 ? parsed[0] : null;
}

export function safeEvaluationHints(text, range) {
  const lines = text.split(/\r?\n/);
  const layout = lines[0]?.replace(/^\uFEFF/, "") === "#!iamlisp layout-v1";
  const startLine = range?.start?.line || 0;
  const endLine = range?.end?.line ?? lines.length - 1;
  let definitions;

  try {
    definitions = documentDefinitions(text);
  } catch {
    definitions = [];
  }

  return lines.flatMap((line, lineNumber) => {
    if (lineNumber < startLine || lineNumber > endLine) {
      return [];
    }

    try {
      const expression = expressionForLine(line, layout);
      if (expression === undefined) {
        return [];
      }
      const env = buildDocumentEnv(definitions, lineNumber);
      const result = safeEvaluate(expression, env);
      if (
        !result.safe ||
        Array.isArray(result.value) ||
        result.value instanceof Map ||
        result.value?.type === "pure-function"
      ) {
        return [];
      }
      return [
        {
          position: { line: lineNumber, character: line.length },
          label: ` => ${String(print(result.value))}`,
          paddingLeft: true
        }
      ];
    } catch {
      return [];
    }
  });
}

export { safeEvaluate };

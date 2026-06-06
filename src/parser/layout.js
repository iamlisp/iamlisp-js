const LAYOUT_HEADER = "#!iamlisp layout-v1";

function syntaxError(lineNumber, message) {
  throw new SyntaxError(`Layout syntax error at line ${lineNumber}: ${message}`);
}

function parseLine(parseBracketSyntax, content, lineNumber) {
  try {
    return parseBracketSyntax(content).filter(expr => expr !== undefined);
  } catch (error) {
    syntaxError(lineNumber, error.message);
  }
}

function createNode(parseBracketSyntax, content, depth, lineNumber) {
  const raw = content.startsWith("=>");
  const source = raw ? content.slice(2).trimStart() : content;

  if (source.length === 0) {
    syntaxError(lineNumber, raw ? "expected expression after =>" : "empty expression");
  }

  const expressions = parseLine(parseBracketSyntax, source, lineNumber);

  if (expressions.length === 0) {
    syntaxError(lineNumber, "expected expression");
  }
  if (raw && expressions.length !== 1) {
    syntaxError(lineNumber, "=> requires exactly one expression");
  }

  return {
    depth,
    lineNumber,
    raw,
    value: raw ? expressions[0] : expressions,
    children: []
  };
}

function materialize(node) {
  if (node.raw && node.children.length > 0) {
    syntaxError(node.lineNumber, "=> expression cannot have nested expressions");
  }

  if (!node.raw) {
    node.value.push(...node.children.map(materialize));
  }

  return node.value;
}

export function isLayoutProgram(program) {
  const firstLine = program.replace(/^\uFEFF/, "").split(/\r?\n/, 1)[0];
  return firstLine === LAYOUT_HEADER;
}

export default function parseLayout(program, parseBracketSyntax) {
  const lines = program.replace(/^\uFEFF/, "").split(/\r?\n/);
  const roots = [];
  const parents = [];
  const indentationWidths = [0];
  let previousWidth = 0;
  let previousDepth = 0;
  let hasExpression = false;

  lines.slice(1).forEach((line, index) => {
    const lineNumber = index + 2;

    if (/^[\t ]*$/.test(line) || /^[\t ]*;/.test(line)) {
      return;
    }

    const indentation = line.match(/^[\t ]*/)[0];
    const width = indentation.length;
    const content = line.slice(width);

    if (!hasExpression && width !== 0) {
      syntaxError(lineNumber, "first expression must not be indented");
    }

    let depth;
    if (width > previousWidth) {
      depth = previousDepth + 1;
      indentationWidths[depth] = width;
      indentationWidths.length = depth + 1;
    } else if (width === previousWidth) {
      depth = previousDepth;
    } else {
      depth = indentationWidths.lastIndexOf(width);
      if (depth === -1) {
        syntaxError(lineNumber, "dedent must match a previous indentation width");
      }
      indentationWidths.length = depth + 1;
    }

    const node = createNode(parseBracketSyntax, content, depth, lineNumber);

    if (depth === 0) {
      roots.push(node);
    } else {
      const parent = parents[depth - 1];
      if (!parent) {
        syntaxError(lineNumber, "missing parent expression");
      }
      parent.children.push(node);
    }

    parents[depth] = node;
    parents.length = depth + 1;
    previousWidth = width;
    previousDepth = depth;
    hasExpression = true;
  });

  return roots.map(materialize);
}

export { LAYOUT_HEADER };

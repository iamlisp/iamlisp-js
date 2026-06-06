import createReader from "./reader";
import readProgram from "./readers/readProgram";
import parseLayout, { isLayoutProgram } from "./layout";

export function parseBracketSyntax(expr) {
  const reader = createReader(expr);
  return readProgram(reader);
}

export default function parse(expr) {
  return isLayoutProgram(expr)
    ? parseLayout(expr, parseBracketSyntax)
    : parseBracketSyntax(expr);
}

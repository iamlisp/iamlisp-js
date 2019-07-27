import readExpression from "./readExpression";
import skipDelimiters from "../helpers/skipDelimiters";

export default function readProgram(reader) {
  const { isEof } = reader;

  let expr = [];

  while (!isEof()) {
    expr.push(readExpression(reader));
    skipDelimiters(reader);
  }

  return expr;
}

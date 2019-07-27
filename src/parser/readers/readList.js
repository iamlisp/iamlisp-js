import skipDelimeters from "../helpers/skipDelimiters";
import { chars } from "../chars";
import readExpression from "./readExpression";

export default function readList(reader) {
  const { currentChar, isEof, nextChar } = reader;

  let expr = [];

  while (!isEof()) {
    skipDelimeters(reader);

    if (currentChar() === chars.RIGHT_PAREN) {
      nextChar();
      return expr;
    }

    expr.push(readExpression(reader));

    // skipDelimeters(reader);
  }

  throw new Error("Unclosed list expression");
}

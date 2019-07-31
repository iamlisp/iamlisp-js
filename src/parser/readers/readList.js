import readExpression from "./readExpression";
import skipDelimiters from "../helpers/skipDelimiters";
import { chars } from "../chars";
import identifiedExpression from "../../persistence/identifiedExpression";

export default function readList(reader) {
  const { currentChar, isEof, nextChar } = reader;

  let expr = [];

  while (!isEof()) {
    skipDelimiters(reader);

    if (currentChar() === chars.RIGHT_PAREN) {
      nextChar();
      return identifiedExpression(...expr);
    }

    expr.push(readExpression(reader));
  }

  throw new Error("Unclosed list expression");
}

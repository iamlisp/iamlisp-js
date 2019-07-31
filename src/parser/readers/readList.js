import uuid from "uuid/v4";
import readExpression from "./readExpression";
import skipDelimiters from "../helpers/skipDelimiters";
import expressionId from "../../persistence/expressionId";
import { chars } from "../chars";

export default function readList(reader) {
  const { currentChar, isEof, nextChar } = reader;

  let expr = [];

  expr[expressionId] = uuid();

  while (!isEof()) {
    skipDelimiters(reader);

    if (currentChar() === chars.RIGHT_PAREN) {
      nextChar();
      return expr;
    }

    expr.push(readExpression(reader));
  }

  throw new Error("Unclosed list expression");
}

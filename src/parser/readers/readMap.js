import { chunk } from "lodash";
import readExpression from "./readExpression";
import skipDelimiters from "../helpers/skipDelimiters";
import { chars } from "../chars";

export default function readMap(reader) {
  const { currentChar, isEof, nextChar } = reader;

  let expr = [];

  while (!isEof()) {
    skipDelimiters(reader);

    if (currentChar() === chars.RIGHT_BRACKET) {
      nextChar();
      return chunk(expr, 2).reduce((acc, [key, value]) => {
        acc.set(key, value);
        return acc;
      }, new Map());
    }

    expr.push(readExpression(reader));

    // skipDelimiters(reader);
  }

  throw new Error("Unclosed map expression");
}

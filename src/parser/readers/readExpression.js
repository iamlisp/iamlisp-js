import readString from "./readString";
import readList from "./readList";
import readMap from "./readMap";
import readComment from "./readComment";
import readSymbol from "./readSymbol";
import readQuote from "./readQuote";
import readMeta from "./readMeta";
import readSharp from "./readSharp";
import { chars, reserved } from "../chars";
import withPlugins from "../plugins";
import skipDelimiters from "../helpers/skipDelimiters";
import readArray from "./readArray";

export default function readExpression(reader) {
  const { currentChar, isEof, nextChar } = reader;

  let expr;
  skipDelimiters(reader);

  if (isEof()) {
    throw new Error("Unexpected EOF while expression parsing");
  }

  if (currentChar() === chars.DOUBLE_QUOTE) {
    nextChar();
    expr = readString(reader);
  } else if (currentChar() === chars.LEFT_PAREN) {
    nextChar();
    expr = readList(reader);
  } else if (currentChar() === chars.SINGLE_QUOTE) {
    nextChar();
    expr = readQuote(reader);
  } else if (currentChar() === chars.CARET) {
    nextChar();
    expr = readMeta(reader);
  } else if (currentChar() === chars.LEFT_BRACKET) {
    nextChar();
    expr = readMap(reader);
  } else if (currentChar() === chars.LEFT_SQUARE_BRACKET) {
    nextChar();
    expr = readArray(reader);
  } else if (currentChar() === chars.SEMICOLON) {
    nextChar();
    readComment(reader);
    expr = undefined;
  } else if (currentChar() === chars.SHARP) {
    nextChar();
    expr = readSharp(reader);
  } else if (reserved.has(currentChar())) {
    throw new Error(`Unexpected token - '${currentChar()}'`);
  } else {
    expr = readSymbol(reader);
  }

  return withPlugins(expr);
}

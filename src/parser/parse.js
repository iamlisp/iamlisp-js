import createReader from "./reader";
import { delimiters, reserved, chars } from "./chars";
import interpretLiteral from "./interpretLiteral";
import Symbl from "../types/Symbl";
import withPlugins from "../plugins";

export default function parse(expr) {
  const { currentChar, isEof, nextChar } = createReader(expr);

  const skipDelimiters = () => {
    while (!isEof() && delimiters.has(currentChar())) {
      nextChar();
    }
  };

  const parseSymbol = () => {
    let sym = "";

    while (!isEof()) {
      if (reserved.has(currentChar())) {
        break;
      }

      sym += currentChar();

      nextChar();
    }

    const { interpreted, literal } = interpretLiteral(sym);

    return interpreted ? literal : new Symbl(sym);
  };

  const parseString = () => {
    let body = "";
    let escape = false;

    while (!isEof()) {
      const char = currentChar();

      if (!escape && char === chars.DOUBLE_QUOTE) {
        nextChar();
        return body;
      }

      if (char === chars.BACKSLASH) {
        escape = true;
      } else {
        body += char;
        escape = false;
      }

      nextChar();
    }

    throw new Error("Not closed string literal");
  };

  const parseExpression = () => {
    if (currentChar() === chars.DOUBLE_QUOTE) {
      nextChar();
      return parseString();
    }
    if (currentChar() === chars.LEFT_PAREN) {
      nextChar();
      return parseList();
    }
    if (currentChar() === chars.SINGLE_QUOTE) {
      nextChar();
      skipDelimiters();
      return [new Symbl("quote"), parseExpression()];
    }
    if (reserved.has(currentChar())) {
      throw new Error(`Unexpected token - '${currentChar()}'`);
    }
    return parseSymbol();
  };

  const parseList = () => {
    let expr = [];

    while (!isEof()) {
      skipDelimiters();

      if (currentChar() === chars.RIGHT_PAREN) {
        nextChar();
        return expr;
      }

      expr.push(withPlugins(parseExpression()));

      skipDelimiters();
    }

    throw new Error("Unclosed list expression");
  };

  const parseProgram = () => {
    let expr = [];

    while (!isEof()) {
      skipDelimiters();
      expr.push(withPlugins(parseExpression()));
      skipDelimiters();
    }

    return expr;
  };

  return parseProgram();
}

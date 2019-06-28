import { chunk } from "lodash";
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
    let expr;
    if (currentChar() === chars.DOUBLE_QUOTE) {
      nextChar();
      expr = parseString();
    } else if (currentChar() === chars.LEFT_PAREN) {
      nextChar();
      expr = parseList();
    } else if (currentChar() === chars.SINGLE_QUOTE) {
      nextChar();
      skipDelimiters();
      expr = [new Symbl("quote"), parseExpression()];
    } else if (currentChar() === chars.LEFT_BRACKET) {
      nextChar();
      expr = parseMap();
    } else if (reserved.has(currentChar())) {
      throw new Error(`Unexpected token - '${currentChar()}'`);
    } else {
      expr = parseSymbol();
    }
    return withPlugins(expr);
  };

  const parseList = () => {
    let expr = [];

    while (!isEof()) {
      skipDelimiters();

      if (currentChar() === chars.RIGHT_PAREN) {
        nextChar();
        return expr;
      }

      expr.push(parseExpression());

      skipDelimiters();
    }

    throw new Error("Unclosed list expression");
  };

  const parseMap = () => {
    let expr = [];

    while (!isEof()) {
      skipDelimiters();

      if (currentChar() === chars.RIGHT_BRACKET) {
        nextChar();
        return chunk(expr, 2).reduce((acc, [key, value]) => {
          if (key instanceof Symbl) {
            acc[key.name] = value;
          } else if (typeof key === "string") {
            acc[key] = value;
          } else {
            throw new Error(`Map key should be of type symbol or string`);
          }
          return acc;
        }, {});
      }

      expr.push(parseExpression());

      skipDelimiters();
    }

    throw new Error("Unclosed map expression");
  };

  const parseProgram = () => {
    let expr = [];

    while (!isEof()) {
      skipDelimiters();
      expr.push(parseExpression());
      skipDelimiters();
    }

    return expr;
  };

  return parseProgram();
}

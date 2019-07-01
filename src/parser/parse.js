import { chunk } from "lodash";
import createReader from "./reader";
import { delimiters, reserved, chars, punctuators } from "./chars";
import interpretLiteral from "./interpretLiteral";
import withPlugins from "./plugins";
import Symbl from "../types/Symbl";
import DotPunctuator from "../types/DotPunctuator";

export default function parse(expr) {
  const { currentChar, isEof, nextChar } = createReader(expr);

  const skipDelimiters = () => {
    while (!isEof() && delimiters.has(currentChar())) {
      nextChar();
    }
  };

  const parseComment = () => {
    while (!isEof()) {
      if (currentChar() === chars.LINE_FEED) {
        return;
      }
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

    if (sym === punctuators.DOT) {
      return DotPunctuator.INSTANCE;
    }

    const [interpretedLiteral, literal] = interpretLiteral(sym);

    if (interpretedLiteral) {
      return literal;
    }

    return new Symbl(sym);
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
    } else if (currentChar() === chars.SEMICOLON) {
      nextChar();
      parseComment();
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
      const parsedExpression = parseExpression();
      if (parsedExpression !== undefined) {
        expr.push(parsedExpression);
      }
      skipDelimiters();
    }

    return expr;
  };

  return parseProgram();
}

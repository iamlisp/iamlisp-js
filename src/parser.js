const { reserved, chars, delimiters } = require('./chars');
const Symbol = require('./Symbol');
const { chunkToMap } = require('./util');
const filter = require('./plugins');

const looksLikeBoolean = (exp) => (
  ['true', 'false'].includes(exp)
);

const looksLikeNumber = (exp) => (
  !isNaN(parseFloat(exp))
);

const interpretValue = (value) => {
  if (looksLikeBoolean(value)) {
    return value === 'true';
  }
  if (looksLikeNumber(value)) {
    return parseFloat(value);
  }
  return new Symbol(value);
}

module.exports = (code) => {
  let offset = 0;

  const currentChar = () => code[offset];
  const isEof = () => offset >= code.length;
  const nextChar = () => offset += 1;

  const skipDelimiters = () => {
    while (!isEof() && delimiters.has(currentChar())) {
      nextChar();
    }
  };

  const parseSymbol = () => {
    let sym = '';

    while (!isEof()) {
      if (reserved.has(currentChar())) {
        break;
      }

      sym += currentChar();

      nextChar();
    }

    return interpretValue(filter(sym));
  };

  const parseString = () => {
    let body = '';
    let escape = false;

    while (!isEof()) {
      const char = currentChar();

      if (!escape && char === chars.DOUBLE_QUOTE) {
        nextChar();
        return filter(body);
      }

      if (char === chars.BACKSLASH) {
        escape = true;
      } else {
        body += char;
        escape = false;
      }

      nextChar();
    }

    throw new Error('Not closed string literal');
  };

  const parseExpression = () => {
    skipDelimiters();

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
      return [new Symbol('quote'), parseExpression()];
    }
    if (reserved.has(currentChar())) {
      throw new Error(`Unexpected token - ${currentChar()}`);
    }
    return parseSymbol();
  };

  const parseList = () => {
    let body = [];

    while (!isEof()) {
      skipDelimiters();

      if (currentChar() === chars.RIGHT_PAREN) {
        nextChar();
        return filter(body);
      }

      body.push(parseExpression());
    }

    throw new Error('Unclosed list expression');
  };

  const parseProgram = () => {
    let expressions = [];

    while (!isEof()) {
      skipDelimiters();
      expressions.push(parseExpression());
    }

    return filter(expressions);
  };

  return parseProgram();

};

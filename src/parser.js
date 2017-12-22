const Symbol = require('./Symbol');
const { chunkToMap } = require('./util');

const TOKEN_SPACE = ' ';
const TOKEN_TAB = '\t';
const TOKEN_CR = '\r';
const TOKEN_LF = '\n';
const TOKEN_LEFT_LIST = '(';
const TOKEN_RIGHT_LIST = ')';
const TOKEN_STRING = '"';
const TOKEN_ESCAPE = '\\';

const punctuators = new Set([
  TOKEN_SPACE,
  TOKEN_TAB,
  TOKEN_CR,
  TOKEN_LF,
  TOKEN_LEFT_LIST,
  TOKEN_RIGHT_LIST,
  TOKEN_STRING,
]);

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

  const parseSymbol = () => {
    let sym = '';
    let escape = false;

    while (!isEof()) {
      const char = currentChar();

      if (!escape && (punctuators.has(char))) {
        break;
      }

      if (char === TOKEN_ESCAPE) {
        escape = true;
      } else {
        sym += char;
        escape = false;
      }

      nextChar();
    }

    if (escape) {
      throw new Error('Unused escape token');
    }

    return interpretValue(sym);
  };

  const parseString = () => {
    let body = '';
    let escape = false;

    while (!isEof()) {
      const char = currentChar();

      if (!escape && char === TOKEN_STRING) {
        return body;
      }

      if (char === TOKEN_ESCAPE) {
        escape = true;
      } else {
        body += char;
        escape = false;
      }

      nextChar();
    }

    throw new Error('Unclosed string literal');
  };

  const parseList = (endOfListToken) => {
    let body = new Array();

    while (!isEof()) {
      const char = currentChar();

      if (char === TOKEN_LEFT_LIST) {
        nextChar();
        body.push(parseList(TOKEN_RIGHT_LIST));
      } else if (endOfListToken && char === endOfListToken) {
        return body;
      } else if (char === TOKEN_STRING) {
        nextChar();
        body.push(parseString());
      } else if (punctuators.has(char)) {
        // Ignore delimiters
      } else {
        body.push(parseSymbol());
        continue;
      }

      nextChar();
    }

    if (endOfListToken) {
      throw new Error('Unclosed list expression');
    }

    return body;
  };

  return parseList();

};

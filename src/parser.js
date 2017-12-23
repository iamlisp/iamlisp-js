const Symbol = require('./Symbol');
const { chunkToMap } = require('./util');
const filter = require('./plugins');

const TOKEN_LIST_OPEN = '(';
const TOKEN_LIST_CLOSE = ')';
const TOKEN_QUOTE = '"';
const TOKEN_ESCAPE = '\\';

const punctuators = new Set([
  ' ',
  '\t',
  '\n',
  '\r',
  TOKEN_LIST_OPEN,
  TOKEN_LIST_CLOSE,
  TOKEN_QUOTE,
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

    return interpretValue(filter(sym));
  };

  const parseString = () => {
    let body = '';
    let escape = false;

    while (!isEof()) {
      const char = currentChar();

      if (!escape && char === TOKEN_QUOTE) {
        return filter(body);
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

  const parseList = () => {
    let body = new Array();

    while (!isEof()) {
      const char = currentChar();

      if (char === TOKEN_LIST_CLOSE) {
        return filter(body);
      } else if (char === TOKEN_LIST_OPEN) {
        nextChar();
        body.push(parseList());
      } else if (char === TOKEN_QUOTE) {
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

    throw new Error('Unclosed list expression');
  };

  const parseProgram = () => {
    let expressions = [];

    while (!isEof()) {
      const char = currentChar();

      if (char === TOKEN_LIST_CLOSE) {
        throw new Error('Unexpected list close');
      } else if (char === TOKEN_LIST_OPEN) {
        nextChar();
        expressions.push(parseList());
      } else if (char === TOKEN_QUOTE) {
        nextChar();
        expressions.push(parseString());
      } else if (punctuators.has(char)) {
        // Ignore delimiters
      } else {
        expressions.push(parseSymbol());
        continue;
      }

      nextChar();
    }

    return filter(expressions);
  };

  return parseProgram();

};

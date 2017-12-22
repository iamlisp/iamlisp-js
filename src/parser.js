const Symbol = require('./Symbol');
const { chunkToMap } = require('./util');

const listLeftToken = '(';
const listRightToken = ')';
const mapLeftToken = '{';
const mapRightToken = '}';
const escapeToken = '\\';

const parens = new Set([
  listLeftToken,
  listRightToken,
  mapLeftToken,
  mapRightToken,
]);
const punctuators = new Set([' ', '\t', '\r', '\n']);

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

      if (!escape && (punctuators.has(char) || parens.has(char))) {
        break;
      }

      if (char === escapeToken) {
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

    return new Symbol(sym);
  };

  const parseList = (endOfListToken) => {
    let body = [];
    
    while (!isEof()) {
      const char = currentChar();
      
      if (punctuators.has(char)) {
        // Ignore delimiters
      } else if (char === listLeftToken) {
        nextChar();
        body.push(parseList(listRightToken));
      } else if (char === mapLeftToken) {
        nextChar();
        body.push(chunkToMap(parseList(mapRightToken)));
      } else if (endOfListToken && char === endOfListToken) {
        return body;
      } else {
        body.push(parseSymbol());
        continue;
      }

      nextChar();
    }

    if (endOfListToken) {
      throw new Error('Unclosed list');
    }

    return body;
  };

  return parseList();
  
};

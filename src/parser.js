const Symbol = require('./Symbol');
const { chunkToObject } = require('./util');

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

  const parseList = (endListToken) => {
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
        body.push(parseMap());
      } else if (endListToken && char === endListToken) {
        return body;
      } else {
        body.push(parseSymbol());
        continue;
      }

      nextChar();
    }

    if (endListToken) {
      throw new Error('Unclosed list');
    }

    return body;
  };
  
  const parseMap = () => {
    return chunkToObject(parseList(mapRightToken));
  };

  return parseList();
  
};

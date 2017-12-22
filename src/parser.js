const listLeftToken = '(';
const listRightToken = ')';
const mapLeftToken = '{';
const mapRightToken = '}';
const escapeToken = '\\';

const terminators = new Set([
  listLeftToken,
  listRightToken,
  mapLeftToken,
  mapRightToken,
]);
const delimiters = new Set([' ', '\t', '\r', '\n']);

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

      if (!escape && (delimiters.has(char) || terminators.has(char))) {
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

    return sym;
  };

  const parseList = (bracketless) => {
    let body = [];
    
    while (!isEof()) {
      const char = currentChar();
      
      if (delimiters.has(char)) {
        // Ignore delimiters
      } else if (char === listLeftToken) {
        nextChar();
        body.push(parseList(false));
      } else if (char === listRightToken) {
        if (bracketless) {
          throw new Error('Unexpected list close');
        }
        return body;
      } else if (char === mapLeftToken) {
        nextChar();
        body.push(parseMap());
      } else {
        body.push(parseSymbol());
        continue;
      }

      nextChar();
    }

    if (!bracketless) {
      throw new Error('Unclosed list');
    }

    return body;
  };
  
  const parseMap = () => {};

  return parseList(true);
  
};

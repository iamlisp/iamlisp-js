const delimiters = new Set([' ', '\t', '\r', '\n']);
const listLeftToken = '(';
const listRightToken = ')';
const mapLeftToken = '{';
const mapRightToken = '}';
const escapeToken = '\\';

module.exports.default = (code) => {
  let offset = 0;

  const currentChar = () => code[offset];

  const isEof = () => offset >= code.length;

  const nextChar = () => offset += 1;

  const parseSymbol = () => {
    let sym = '';
    let escape = false;

    while (!isEof()) {
      const char = currentChar();

      if (!escape && delimiters.has(char)) {
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
      throw new Error(`Unused escape token`);
    }

    return sym;
  };

  const parseList = () => {};
  
  const parseMap = () => {};

  const parseCode = () => {
    const list = [];
    
    while (!isEof()) {
      const char = currentChar();
      
      if (delimiters.has(char)) {
        continue;
      }

      if (char === listLeftToken) {
        list.push(parseList());
      }

      if (char === mapLeftToken) {
        list.push(parseMap());
      }

      list.push(parseSymbol());
    }

    return list;
  };

  parseCode();
  
};

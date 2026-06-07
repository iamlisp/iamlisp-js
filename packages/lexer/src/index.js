const TokenType = Object.freeze({
  LEFT_PAREN: "leftParen",
  RIGHT_PAREN: "rightParen",
  LEFT_BRACKET: "leftBracket",
  RIGHT_BRACKET: "rightBracket",
  LEFT_BRACE: "leftBrace",
  RIGHT_BRACE: "rightBrace",
  SYMBOL: "symbol",
  NUMBER: "number",
  STRING: "string",
  COMMENT: "comment",
  QUOTE: "quote",
  CARET: "caret",
  SHARP: "sharp",
  DOT: "dot",
  ELLIPSIS: "ellipsis",
  LAYOUT_HEADER: "layoutHeader",
  RAW_EXPRESSION: "rawExpression",
  NEWLINE: "newline",
  INDENT: "indent",
  DEDENT: "dedent",
  EOF: "eof"
});

const tokenTypes = new Set(Object.values(TokenType));
const singleByteTokens = new Map([
  [0x28, TokenType.LEFT_PAREN],
  [0x29, TokenType.RIGHT_PAREN],
  [0x5b, TokenType.LEFT_BRACKET],
  [0x5d, TokenType.RIGHT_BRACKET],
  [0x7b, TokenType.LEFT_BRACE],
  [0x7d, TokenType.RIGHT_BRACE],
  [0x27, TokenType.QUOTE],
  [0x5e, TokenType.CARET],
  [0x23, TokenType.SHARP]
]);

function assertInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`${name} must be a non-negative integer`);
  }
}

function createPosition(position, name) {
  if (!position || typeof position !== "object") {
    throw new TypeError(`${name} must be an object`);
  }

  const { offset, line, column } = position;
  assertInteger(offset, `${name}.offset`);
  assertInteger(line, `${name}.line`);
  assertInteger(column, `${name}.column`);
  return Object.freeze({ offset, line, column });
}

class SourceLocation {
  constructor({ start, end }) {
    this.start = createPosition(start, "start");
    this.end = createPosition(end, "end");

    if (this.end.offset < this.start.offset) {
      throw new RangeError("end.offset must not precede start.offset");
    }

    Object.freeze(this);
  }

  get length() {
    return this.end.offset - this.start.offset;
  }
}

class Token {
  constructor({ type, value, location, modifiers = [] }) {
    if (!tokenTypes.has(type)) {
      throw new TypeError(`Unknown token type "${type}"`);
    }
    if (typeof value !== "string") {
      throw new TypeError("value must be a string");
    }
    if (!(location instanceof SourceLocation)) {
      throw new TypeError("location must be a SourceLocation");
    }
    if (!Array.isArray(modifiers) || modifiers.some(item => typeof item !== "string")) {
      throw new TypeError("modifiers must be an array of strings");
    }

    this.type = type;
    this.value = value;
    this.location = location;
    this.modifiers = Object.freeze([...new Set(modifiers)]);
    Object.freeze(this);
  }

  is(type) {
    return this.type === type;
  }

  hasModifier(modifier) {
    return this.modifiers.includes(modifier);
  }

  withModifiers(...modifiers) {
    return new Token({
      type: this.type,
      value: this.value,
      location: this.location,
      modifiers: [...this.modifiers, ...modifiers]
    });
  }
}

class Lexer {
  #bytes;
  #index = 0;
  #offset = 0;
  #line = 0;
  #column = 0;
  #layout = false;
  #lineStart = true;
  #indentationWidths = [0];
  #indentationByte;

  constructor(reader) {
    if (
      !reader ||
      typeof reader.next !== "function" ||
      typeof reader.eof !== "boolean"
    ) {
      throw new TypeError("reader must expose next, eof, and value");
    }
    this.#bytes = [];
    while (!reader.eof) {
      this.#bytes.push(reader.value);
      reader.next();
    }
  }

  tokenize() {
    const tokens = [];

    while (!this.#eof) {
      if (this.#layout && this.#lineStart) {
        tokens.push(...this.#readIndentation());
        if (this.#eof) {
          break;
        }
      }

      const byte = this.#value;
      if (byte === 0x20 || byte === 0x09 || byte === 0x0d) {
        this.#advance();
      } else if (byte === 0x0a) {
        tokens.push(this.#single(TokenType.NEWLINE));
      } else if (byte === 0x3b) {
        tokens.push(this.#readUntil(TokenType.COMMENT, value => value === 0x0a));
      } else if (byte === 0x22) {
        tokens.push(this.#readString());
      } else if (this.#offset === 0 && this.#startsWith("#!iamlisp layout-v1")) {
        tokens.push(this.#readUntil(TokenType.LAYOUT_HEADER, value => value === 0x0a));
        this.#layout = true;
      } else if (this.#startsWith("=>")) {
        tokens.push(this.#readFixed(TokenType.RAW_EXPRESSION, 2));
      } else if (this.#startsWith("...")) {
        tokens.push(this.#readFixed(TokenType.ELLIPSIS, 3));
      } else if (byte === 0x2e) {
        tokens.push(this.#readFixed(TokenType.DOT, 1));
      } else if (singleByteTokens.has(byte)) {
        tokens.push(this.#single(singleByteTokens.get(byte)));
      } else {
        tokens.push(this.#readSymbol());
      }
    }

    while (this.#indentationWidths.length > 1) {
      this.#indentationWidths.pop();
      tokens.push(this.#empty(TokenType.DEDENT));
    }
    tokens.push(this.#token(TokenType.EOF, [], this.#position(), this.#position()));
    return tokens;
  }

  #position() {
    return { offset: this.#offset, line: this.#line, column: this.#column };
  }

  get #value() {
    return this.#bytes[this.#index];
  }

  get #eof() {
    return this.#index >= this.#bytes.length;
  }

  #advance() {
    const byte = this.#value;
    this.#index += 1;
    this.#offset += 1;
    if (byte === 0x0a) {
      this.#line += 1;
      this.#column = 0;
      this.#lineStart = true;
    } else {
      this.#column += 1;
    }
    return byte;
  }

  #startsWith(text) {
    return [...Buffer.from(text)].every(
      (byte, index) => this.#bytes[this.#index + index] === byte
    );
  }

  #token(type, bytes, start, end) {
    return new Token({
      type,
      value: Buffer.from(bytes).toString("utf8"),
      location: new SourceLocation({ start, end })
    });
  }

  #single(type) {
    const start = this.#position();
    const bytes = [this.#advance()];
    return this.#token(type, bytes, start, this.#position());
  }

  #empty(type) {
    const position = this.#position();
    return this.#token(type, [], position, position);
  }

  #readIndentation() {
    const start = this.#position();
    const bytes = [];

    while (this.#value === 0x20 || this.#value === 0x09) {
      bytes.push(this.#advance());
    }

    if (this.#eof || this.#value === 0x0a || this.#value === 0x3b) {
      return [];
    }

    this.#lineStart = false;
    if (bytes.length > 0) {
      const indentationByte = bytes[0];
      if (
        bytes.some(byte => byte !== indentationByte) ||
        (this.#indentationByte !== undefined &&
          indentationByte !== this.#indentationByte)
      ) {
        throw new SyntaxError(
          `Mixed tabs and spaces in layout indentation at line ${this.#line + 1}`
        );
      }
      this.#indentationByte ??= indentationByte;
    }
    const width = bytes.length;
    const previousWidth = this.#indentationWidths.at(-1);

    if (width > previousWidth) {
      this.#indentationWidths.push(width);
      return [this.#token(TokenType.INDENT, bytes, start, this.#position())];
    }
    if (width === previousWidth) {
      return [];
    }

    const depth = this.#indentationWidths.lastIndexOf(width);
    if (depth === -1) {
      throw new SyntaxError(
        `Invalid layout dedent at line ${this.#line + 1}: width ${width} was not previously used`
      );
    }

    const tokens = [];
    while (this.#indentationWidths.length - 1 > depth) {
      this.#indentationWidths.pop();
      tokens.push(this.#empty(TokenType.DEDENT));
    }
    return tokens;
  }

  #readFixed(type, length) {
    const start = this.#position();
    const bytes = [];
    for (let index = 0; index < length; index += 1) {
      bytes.push(this.#advance());
    }
    return this.#token(type, bytes, start, this.#position());
  }

  #readUntil(type, stop) {
    const start = this.#position();
    const bytes = [];
    while (!this.#eof && !stop(this.#value)) {
      bytes.push(this.#advance());
    }
    return this.#token(type, bytes, start, this.#position());
  }

  #readString() {
    const start = this.#position();
    const bytes = [this.#advance()];
    let escaped = false;

    while (!this.#eof) {
      const byte = this.#advance();
      bytes.push(byte);
      if (!escaped && byte === 0x22) {
        return this.#token(TokenType.STRING, bytes, start, this.#position());
      }
      escaped = !escaped && byte === 0x5c;
    }

    throw new SyntaxError("Unclosed string literal");
  }

  #readSymbol() {
    const token = this.#readUntil(
      TokenType.SYMBOL,
      byte =>
        byte === undefined ||
        byte === 0x20 ||
        byte === 0x09 ||
        byte === 0x0a ||
        byte === 0x0d ||
        byte === 0x3b ||
        byte === 0x22 ||
        singleByteTokens.has(byte) ||
        [0x29, 0x5d, 0x7d].includes(byte)
    );
    return /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(token.value)
      ? new Token({
          type: TokenType.NUMBER,
          value: token.value,
          location: token.location
        })
      : token;
  }
}

module.exports = {
  Lexer,
  SourceLocation,
  Token,
  TokenType
};

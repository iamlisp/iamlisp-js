const test = require("node:test");
const assert = require("node:assert/strict");
const { Reader } = require("@iamlisp/reader");
const { Lexer, SourceLocation, Token, TokenType } = require("../src");

const location = () =>
  new SourceLocation({
    start: { offset: 1, line: 0, column: 1 },
    end: { offset: 4, line: 0, column: 4 }
  });

test("declares immutable tokens with source locations", () => {
  const token = new Token({
    type: TokenType.SYMBOL,
    value: "def",
    location: location()
  });

  assert.equal(token.location.length, 3);
  assert.equal(token.is(TokenType.SYMBOL), true);
  assert.equal(Object.isFrozen(token), true);
  assert.equal(Object.isFrozen(token.location), true);
});

test("creates enriched copies without mutating lexical token", () => {
  const lexical = new Token({
    type: TokenType.SYMBOL,
    value: "x",
    location: location()
  });
  const semantic = lexical.withModifiers("declaration", "readonly");

  assert.deepEqual(lexical.modifiers, []);
  assert.deepEqual(semantic.modifiers, ["declaration", "readonly"]);
  assert.equal(semantic.hasModifier("declaration"), true);
});

test("rejects invalid declarations", () => {
  assert.throws(
    () => new Token({ type: "unknown", value: "x", location: location() }),
    /Unknown token type/
  );
  assert.throws(
    () =>
      new SourceLocation({
        start: { offset: 2, line: 0, column: 2 },
        end: { offset: 1, line: 0, column: 1 }
      }),
    /must not precede/
  );
});

const lex = source => new Lexer(new Reader(source)).tokenize();
const compact = source =>
  lex(source).map(token => [token.type, token.value]);

test("lexes lists, symbols, numbers, strings, and comments", () => {
  assert.deepEqual(compact('(def x -10) ; note\n(print "hi")'), [
    [TokenType.LEFT_PAREN, "("],
    [TokenType.SYMBOL, "def"],
    [TokenType.SYMBOL, "x"],
    [TokenType.NUMBER, "-10"],
    [TokenType.RIGHT_PAREN, ")"],
    [TokenType.COMMENT, "; note"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.LEFT_PAREN, "("],
    [TokenType.SYMBOL, "print"],
    [TokenType.STRING, '"hi"'],
    [TokenType.RIGHT_PAREN, ")"],
    [TokenType.EOF, ""]
  ]);
});

test("lexes layout markers and punctuation", () => {
  assert.deepEqual(compact("#!iamlisp layout-v1\n=> (+ 1 2)\n... . 'x ^x #x"), [
    [TokenType.LAYOUT_HEADER, "#!iamlisp layout-v1"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.RAW_EXPRESSION, "=>"],
    [TokenType.LEFT_PAREN, "("],
    [TokenType.SYMBOL, "+"],
    [TokenType.NUMBER, "1"],
    [TokenType.NUMBER, "2"],
    [TokenType.RIGHT_PAREN, ")"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.ELLIPSIS, "..."],
    [TokenType.DOT, "."],
    [TokenType.QUOTE, "'"],
    [TokenType.SYMBOL, "x"],
    [TokenType.CARET, "^"],
    [TokenType.SYMBOL, "x"],
    [TokenType.SHARP, "#"],
    [TokenType.SYMBOL, "x"],
    [TokenType.EOF, ""]
  ]);
});

test("emits relative layout indentation tokens", () => {
  assert.deepEqual(
    compact("#!iamlisp layout-v1\ndefun f (x)\n  cond\n       else\n          => x\nf 1"),
    [
      [TokenType.LAYOUT_HEADER, "#!iamlisp layout-v1"],
      [TokenType.NEWLINE, "\n"],
      [TokenType.SYMBOL, "defun"],
      [TokenType.SYMBOL, "f"],
      [TokenType.LEFT_PAREN, "("],
      [TokenType.SYMBOL, "x"],
      [TokenType.RIGHT_PAREN, ")"],
      [TokenType.NEWLINE, "\n"],
      [TokenType.INDENT, "  "],
      [TokenType.SYMBOL, "cond"],
      [TokenType.NEWLINE, "\n"],
      [TokenType.INDENT, "       "],
      [TokenType.SYMBOL, "else"],
      [TokenType.NEWLINE, "\n"],
      [TokenType.INDENT, "          "],
      [TokenType.RAW_EXPRESSION, "=>"],
      [TokenType.SYMBOL, "x"],
      [TokenType.NEWLINE, "\n"],
      [TokenType.DEDENT, ""],
      [TokenType.DEDENT, ""],
      [TokenType.DEDENT, ""],
      [TokenType.SYMBOL, "f"],
      [TokenType.NUMBER, "1"],
      [TokenType.EOF, ""]
    ]
  );
});

test("supports tab indentation", () => {
  assert.deepEqual(compact("#!iamlisp layout-v1\nroot\n\tchild\n\t\tgrandchild"), [
    [TokenType.LAYOUT_HEADER, "#!iamlisp layout-v1"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.SYMBOL, "root"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.INDENT, "\t"],
    [TokenType.SYMBOL, "child"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.INDENT, "\t\t"],
    [TokenType.SYMBOL, "grandchild"],
    [TokenType.DEDENT, ""],
    [TokenType.DEDENT, ""],
    [TokenType.EOF, ""]
  ]);
});

test("rejects mixed tabs and spaces in layout indentation", () => {
  assert.throws(
    () => lex("#!iamlisp layout-v1\nroot\n\t child"),
    /Mixed tabs and spaces.*line 3/
  );
  assert.throws(
    () => lex("#!iamlisp layout-v1\nroot\n\tchild\n  peer"),
    /Mixed tabs and spaces.*line 4/
  );
});

test("blank and comment-only layout lines do not change indentation", () => {
  assert.deepEqual(compact("#!iamlisp layout-v1\nroot\n  child\n      ; note\n\n  peer"), [
    [TokenType.LAYOUT_HEADER, "#!iamlisp layout-v1"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.SYMBOL, "root"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.INDENT, "  "],
    [TokenType.SYMBOL, "child"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.COMMENT, "; note"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.NEWLINE, "\n"],
    [TokenType.SYMBOL, "peer"],
    [TokenType.DEDENT, ""],
    [TokenType.EOF, ""]
  ]);
});

test("rejects layout dedent widths not previously used", () => {
  assert.throws(
    () =>
      lex("#!iamlisp layout-v1\nroot\n    child\n  invalid"),
    /Invalid layout dedent at line 4/
  );
});

test("bracket syntax continues to ignore spaces and tabs", () => {
  assert.deepEqual(compact("  (  +\t1 2 )"), [
    [TokenType.LEFT_PAREN, "("],
    [TokenType.SYMBOL, "+"],
    [TokenType.NUMBER, "1"],
    [TokenType.NUMBER, "2"],
    [TokenType.RIGHT_PAREN, ")"],
    [TokenType.EOF, ""]
  ]);
});

test("tracks UTF-8 byte locations", () => {
  const [symbol, newline, next] = lex("é\nx");

  assert.equal(symbol.value, "é");
  assert.equal(symbol.location.length, 2);
  assert.deepEqual(newline.location.start, { offset: 2, line: 0, column: 2 });
  assert.deepEqual(next.location.start, { offset: 3, line: 1, column: 0 });
});

test("consumes reader and rejects unclosed strings", () => {
  const reader = new Reader("x");
  const lexer = new Lexer(reader);

  assert.equal(reader.eof, true);
  assert.throws(() => new Lexer(new Reader('"x')).tokenize(), /Unclosed string/);
  assert.deepEqual(lexer.tokenize().map(token => token.value), ["x", ""]);
});

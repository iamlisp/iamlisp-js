# @iamlisp/lexer

Reader-backed lexer and immutable token value objects.

```js
const { Lexer, TokenType } = require("@iamlisp/lexer");
const { Reader } = require("@iamlisp/reader");

const tokens = new Lexer(new Reader("(def x 10)")).tokenize();
```

The lexer consumes bytes through only `reader.value`, `reader.next()`, and
`reader.eof`. Token values preserve their source lexemes. Source offsets and
columns count UTF-8 bytes.

With the exact `#!iamlisp layout-v1` header, leading whitespace produces
`INDENT` and `DEDENT` tokens. A document must use only tabs or only spaces for
indentation; mixing them is an error. Any increase opens one level. Dedents
must match a previously used width. Blank and comment-only lines do not change
depth.

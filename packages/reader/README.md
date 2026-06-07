# @iamlisp/reader

Minimal cursor over a string of UTF-8 bytes.

```js
const { Reader } = require("@iamlisp/reader");

const reader = new Reader("abc");

while (!reader.eof) {
  console.log(reader.value);
  reader.next();
}
```

- `value`: current byte as a number from `0` through `255`, or `undefined` at
  EOF
- `eof`: whether the cursor reached the end
- `next()`: advance one byte and return the reader

`Reader` also accepts `Buffer` and `Uint8Array` input. It copies input bytes so
external mutation cannot change the reader.

const test = require("node:test");
const assert = require("node:assert/strict");
const { Reader } = require("../src");

test("reads ASCII bytes through next, eof, and value", () => {
  const reader = new Reader("abc");

  assert.equal(reader.eof, false);
  assert.equal(reader.value, 97);
  assert.equal(reader.next(), reader);
  assert.equal(reader.value, 98);
  reader.next().next();
  assert.equal(reader.eof, true);
  assert.equal(reader.value, undefined);
  assert.equal(reader.offset, 3);
});

test("reads UTF-8 strings one byte at a time", () => {
  const reader = new Reader("é");
  const values = [];

  while (!reader.eof) {
    values.push(reader.value);
    reader.next();
  }

  assert.deepEqual(values, [0xc3, 0xa9]);
});

test("reads and copies Uint8Array input", () => {
  const input = Uint8Array.from([1, 2]);
  const reader = new Reader(input);
  input[0] = 9;

  assert.equal(reader.value, 1);
});

test("empty input starts at EOF and next stays there", () => {
  const reader = new Reader("");

  assert.equal(reader.eof, true);
  assert.equal(reader.value, undefined);
  reader.next().next();
  assert.equal(reader.offset, 0);
});

test("rejects unsupported input", () => {
  assert.throws(() => new Reader(null), /input must be/);
  assert.throws(() => new Reader([1, 2]), /input must be/);
});

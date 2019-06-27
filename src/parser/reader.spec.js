import createReader from "./reader";

test("Should correctly read input string", () => {
  const reader = createReader("hello");

  expect(reader.currentChar()).toBe("h");
  expect(reader.isEof()).toBeFalsy();
  reader.nextChar();
  expect(reader.currentChar()).toBe("e");
  expect(reader.isEof()).toBeFalsy();
  reader.nextChar();
  expect(reader.currentChar()).toBe("l");
  expect(reader.isEof()).toBeFalsy();
  reader.nextChar();
  expect(reader.currentChar()).toBe("l");
  expect(reader.isEof()).toBeFalsy();
  reader.nextChar();
  expect(reader.currentChar()).toBe("o");
  expect(reader.isEof()).toBeFalsy();
  reader.nextChar();
  expect(reader.isEof()).toBeTruthy();
});

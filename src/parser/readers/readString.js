import { chars } from "../chars";

export default function readString({ currentChar, isEof, nextChar }) {
  let body = "";
  let escape = false;

  while (!isEof()) {
    const char = currentChar();

    if (!escape && char === chars.DOUBLE_QUOTE) {
      nextChar();
      return body;
    }

    if (char === chars.BACKSLASH) {
      escape = true;
    } else {
      body += char;
      escape = false;
    }

    nextChar();
  }

  throw new Error("Not closed string literal");
}

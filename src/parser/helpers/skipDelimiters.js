import { delimiters } from "../chars";

export default function skipDelimiters({ currentChar, isEof, nextChar }) {
  while (!isEof() && delimiters.has(currentChar())) {
    nextChar();
  }
}

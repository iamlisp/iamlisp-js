import { chars } from "../chars";

export default function readComment({ currentChar, isEof, nextChar }) {
  while (!isEof()) {
    if (currentChar() === chars.LINE_FEED) {
      return;
    }
    nextChar();
  }
}

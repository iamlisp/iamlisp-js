import { reserved, chars, punctuators } from "../chars";
import DotPunctuator from "../../types/DotPunctuator";
import interpretLiteral from "../interpreters/interpretLiteral";
import Symbl from "../../types/Symbl";

export default function readSymbol({ currentChar, isEof, nextChar }) {
  let sym = "";

  while (!isEof()) {
    if (reserved.has(currentChar()) && currentChar() !== chars.COLON) {
      break;
    }

    sym += currentChar();

    nextChar();
  }

  if (sym === punctuators.DOT) {
    return DotPunctuator.INSTANCE;
  }

  const [interpretedLiteral, literal] = interpretLiteral(sym);

  if (interpretedLiteral) {
    return literal;
  }

  return new Symbl(sym);
}

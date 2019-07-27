import Symbl from "../../types/Symbl";
import readExpression from "./readExpression";

const QUOTE_SYMBOL = "quote";

export default function readQuote(reader) {
  return [new Symbl(QUOTE_SYMBOL), readExpression(reader)];
}

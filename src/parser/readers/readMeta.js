import Symbl from "../../types/Symbl";
import readExpression from "./readExpression";

export const WITH_META_SYMBOL = "with-meta";

export default function readMeta(reader) {
  return [
    new Symbl(WITH_META_SYMBOL),
    readExpression(reader),
    readExpression(reader)
  ];
}

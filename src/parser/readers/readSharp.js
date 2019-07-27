import readExpression from "./readExpression";
import Symbl from "../../types/Symbl";

export const SHARP_SYMBOL = "sharp";

export default function readSharp(reader) {
  return [new Symbl(SHARP_SYMBOL), readExpression(reader)];
}

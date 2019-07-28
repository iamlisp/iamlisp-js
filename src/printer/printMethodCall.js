import { punctuators } from "../parser/chars";

export default function printMethodCall(expr) {
  return `${punctuators.DOT}${expr.name}`;
}

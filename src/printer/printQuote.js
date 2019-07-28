import print from "./print";

export default function printQuote(quoteExpr) {
  return `'${print(quoteExpr[1])}`;
}

import print from "./print";

export default function printList(expr) {
  if (expr.empty) {
    return "Nil";
  }

  const items = [];
  let list = expr;
  while (!list.empty) {
    items.push(list.head);
    list = list.tail;
  }

  return `(${items.map(print).join(" ")})`;
}

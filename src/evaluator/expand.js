import Symbl from "../types/Symbl";

function isList(expr) {
  return Array.isArray(expr);
}

function isSymbol(expr) {
  return expr instanceof Symbl;
}

export default function expand(expr, args) {
  if (isSymbol(expr)) {
    return args[expr.name];
  }

  if (isList(expr)) {
    return expr.map(it => expand(it, args));
  }

  return expr;
}

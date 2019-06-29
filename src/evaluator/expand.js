import Symbl from "../types/Symbl";

function isList(expr) {
  return Array.isArray(expr);
}

export default function expand(expr, args) {
  if (expr instanceof Symbl && expr.name in args) {
    return args[expr.name];
  }

  if (isList(expr)) {
    return expr.map(it => expand(it, args));
  }

  return expr;
}

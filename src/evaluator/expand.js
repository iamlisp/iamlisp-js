import Symbl from "../types/Symbl";
import processMacroArgs from "./spread/processMacroArgs";

function isList(expr) {
  return Array.isArray(expr);
}

export default function expand(expr, args) {
  if (expr instanceof Symbl && expr.name in args) {
    return args[expr.name];
  }

  if (isList(expr)) {
    const expandedList = expr.map(it => expand(it, args));
    const processedList = processMacroArgs(expandedList);
    return processedList;
  }

  return expr;
}

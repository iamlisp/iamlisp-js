import { head } from "lodash";
import Symbl from "../../types/Symbl";

const PIPE = "->";
const COMPOSE = "<-";

const expandPipe = xs => {
  const arg = new Symbl("__arg");
  return [
    new Symbl("lambda"),
    [arg],
    xs.reduce((acc, expr) => [expr, acc], arg)
  ];
};

export default function(expr) {
  if (
    Array.isArray(expr) &&
    head(expr) instanceof Symbl &&
    head(expr).name === PIPE
  ) {
    return expandPipe(expr.slice(1));
  }

  if (
    Array.isArray(expr) &&
    head(expr) instanceof Symbl &&
    head(expr).name === COMPOSE
  ) {
    return expandPipe(expr.slice(1).reverse());
  }

  return expr;
}

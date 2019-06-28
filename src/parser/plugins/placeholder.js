import { size } from "lodash";
import Symbl from "../../types/Symbl";

const PLACEHOLDER = "_";

const makeLambda = (args, expr) => [new Symbl("lambda"), args, expr];

export default function(expr) {
  if (!Array.isArray(expr)) {
    return expr;
  }

  const args = [];

  const newExpr = expr.map(x => {
    if (x instanceof Symbl && x.name === PLACEHOLDER) {
      const argName = new Symbl(`__${size(args)}`);
      args.push(argName);
      return argName;
    }
    return x;
  });

  return size(args) > 0 ? makeLambda(args, newExpr) : newExpr;
}

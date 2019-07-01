import { evaluateExpression } from "../evaluate";

export default function evaluateArgumentsNoSpread(args, env) {
  return args.map(arg => evaluateExpression(arg, env));
}

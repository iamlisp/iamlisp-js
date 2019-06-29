import { evaluateExpression } from "../evaluate";
import DotPunctuator from "../../types/DotPunctuator";

export default function evaluateArgs(args, env) {
  let afterDot = false;
  let results = [];

  for (const arg of args) {
    if (arg instanceof DotPunctuator) {
      afterDot = true;
      continue;
    }

    const evaledArg = evaluateExpression(arg, env);

    if (afterDot) {
      if (Array.isArray(evaledArg)) {
        results.push(...evaledArg);
      } else {
        throw new Error("Could not spread non-list value");
      }
      afterDot = false;
    } else {
      results.push(evaledArg);
    }
  }

  return results;
}

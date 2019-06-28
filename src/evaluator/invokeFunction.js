import { convertLambdaToFunction, convertMacroToFunction } from "./helpers";
import Lambda from "../types/Lambda";
import Symbl from "../types/Symbl";
import Macro from "../types/Macro";

export default function invokeFunction(func, env, args) {
  const funcArgs = args.map(arg => {
    if (arg instanceof Lambda) {
      return convertLambdaToFunction(arg);
    }
    if (arg instanceof Macro) {
      return convertMacroToFunction(arg, env);
    }
    if (arg instanceof Symbl) {
      return arg.name;
    }
    return arg;
  });

  if (typeof func !== "function") {
    throw new TypeError(`${func} is not a function`);
  }

  return func.apply(null, funcArgs);
}

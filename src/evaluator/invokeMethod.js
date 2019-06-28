import { convertLambdaToFunction, convertMacroToFunction } from "./helpers";
import Lambda from "../types/Lambda";
import Symbl from "../types/Symbl";
import Macro from "../types/Macro";

export default function invokeMethod(method, env, obj, args) {
  const methodArgs = args.map(arg => {
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
  const methodFunction = obj[method.name];

  if (typeof methodFunction !== "function") {
    throw new TypeError(`${methodFunction} is not a function`);
  }

  return methodFunction.apply(obj, methodArgs);
}

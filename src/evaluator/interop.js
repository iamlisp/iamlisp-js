import Lambda from "../types/Lambda";
import Macro from "../types/Macro";
import Symbl from "../types/Symbl";
import { convertLambdaToFunction, convertMacroToFunction } from "./helpers";

export function getJavascriptGlobal(name) {
  if (typeof global === "object") {
    return global[name];
  }
  if (typeof window === "object") {
    return window[name];
  }
  throw new Error("Unknown environment");
}

export function callJSMethod(method, object, args, env) {
  return object[method].apply(object, castArguments(args, env));
}

export function callJSFunction(func, args, env) {
  return func.apply(null, castArguments(args, env));
}

function castArguments(args, env) {
  return args.map(arg => {
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
}

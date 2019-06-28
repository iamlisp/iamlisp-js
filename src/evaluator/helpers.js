import invokeLambda from "./invokeLambda";
import invokeMacro from "./invokeMacro";
import Lambda from "../types/Lambda";
import Macro from "../types/Macro";
import Symbl from "../types/Symbl";

export const convertLambdaToFunction = lambda => (...args) => {
  return invokeLambda(lambda, args);
};

export const convertMacroToFunction = (macro, env) => (...args) => {
  return invokeMacro(macro, env, args);
};

export function castJsArguments(args, env) {
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

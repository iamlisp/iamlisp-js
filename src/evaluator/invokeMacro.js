import mergeArgs from "./mergeArgs";
import expand from "./expand";
import evaluate from "./evaluate";

export default function invokeMacro(macro, argValues, env) {
  const argNames = macro.args.map(arg => arg.name);
  const mergedArguments = mergeArgs(argNames, argValues);

  const expandedBody = expand(macro.body, mergedArguments);

  return evaluate(expandedBody, env);
}

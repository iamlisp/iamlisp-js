import mergeArgs from "./mergeArgs";
import expand from "./expand";
import evaluate from "./evaluate";

export default function invokeMacro(macro, argValues, env) {
  const mergedArguments = mergeArgs(macro.args, argValues);

  const expandedBody = expand(macro.body, mergedArguments);

  return evaluate(expandedBody, env);
}

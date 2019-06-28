import { size } from "lodash";
import mergeArgs from "./mergeArgs";
import expand from "./expand";
import Lambda from "../types/Lambda";
import Env from "../Env";
import evaluate from "./evaluate";

const AUTO_CURRYING_ENABLED = false;

export default function invokeLambda(lambda, argValues) {
  const argNames = lambda.args.map(arg => arg.name);
  const argValuesSize = size(argValues);

  if (AUTO_CURRYING_ENABLED && size(argNames) > argValuesSize) {
    const unusedArgNames = argNames.slice(0, argValuesSize);
    const mergedArguments = mergeArgs(unusedArgNames, argValues);
    const restArgNames = lambda.args.slice(argValuesSize);

    return new Lambda(
      restArgNames,
      expand(lambda.body, mergedArguments),
      lambda.env
    );
  } else {
    const mergedArguments = mergeArgs(argNames, argValues);
    const lambdaEnv = new Env(mergedArguments, lambda.env);

    return evaluate(lambda.body, lambdaEnv);
  }
}

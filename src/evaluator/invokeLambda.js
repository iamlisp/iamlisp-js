import { isEmpty, size } from "lodash";
import mergeArgs from "./mergeArgs";
import evaluate from "./evaluate";
import Env from "../Env";
import LambdaCall from "../types/LambdaCall";
import Lambda from "../types/Lambda";
import DotPunctuator from "../types/DotPunctuator";

export function canApplyAutoCurrying(lambda) {
  return !lambda.args.some(arg => arg instanceof DotPunctuator);
}

const hasUnboundSymbols = (lambdaArgs, argValues) =>
  lambdaArgs.length > argValues.length;

const getBestOverload = (lambda, argValues) => {
  const argValuesSize = size(argValues);

  if (isEmpty(lambda.overloads)) {
    return lambda;
  }

  const lambdaWithOverloads = [lambda, ...lambda.overloads];

  // Look for lambda with same number of arguments as number of called values
  const foundLambda = lambdaWithOverloads.find(
    l => size(l.args) === argValuesSize
  );

  if (foundLambda) {
    return foundLambda;
  }

  return null;
};

export default function invokeLambda(lambda, argValues, strict = true) {
  const bestOverload = getBestOverload(lambda, argValues);
  const argValuesSize = size(argValues);

  if (bestOverload === null) {
    throw new TypeError(
      `Lambda doesn't contain variant for given number of arguments - ${argValuesSize}`
    );
  }

  if (
    canApplyAutoCurrying(bestOverload) &&
    hasUnboundSymbols(bestOverload.args, argValues)
  ) {
    const boundFrame = mergeArgs(
      bestOverload.args.slice(0, argValuesSize),
      argValues
    );
    const unboundArgNames = bestOverload.args.slice(argValuesSize);

    return new Lambda(
      unboundArgNames,
      bestOverload.body,
      new Env(boundFrame, bestOverload.env)
    );
  }

  const frame = mergeArgs(bestOverload.args, argValues);

  let result = new LambdaCall(bestOverload, frame);

  if (strict) {
    while (result instanceof LambdaCall) {
      const lambdaEnv = new Env(result.frame, result.lambda.env);
      result = evaluate(result.lambda.body, lambdaEnv, false);
    }
  }

  return result;
}

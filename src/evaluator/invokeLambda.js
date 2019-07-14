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

const getBestVariant = (lambda, argValues) => {
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
  const bestVariant = getBestVariant(lambda, argValues);
  const argValuesSize = size(argValues);

  if (bestVariant === null) {
    throw new TypeError(
      `Lambda doesn't contain variant for given number of arguments - ${argValuesSize}`
    );
  }

  if (
    canApplyAutoCurrying(bestVariant) &&
    hasUnboundSymbols(bestVariant.args, argValues)
  ) {
    const boundFrame = mergeArgs(
      bestVariant.args.slice(0, argValuesSize),
      argValues
    );
    const unboundArgNames = bestVariant.args.slice(argValuesSize);

    return new Lambda(
      unboundArgNames,
      bestVariant.body,
      new Env(boundFrame, bestVariant.env)
    );
  }

  const frame = mergeArgs(bestVariant.args, argValues);

  let result = new LambdaCall(bestVariant, frame);

  if (strict) {
    while (result instanceof LambdaCall) {
      const lambdaEnv = new Env(result.frame, result.lambda.env);
      result = evaluate(result.lambda.body, lambdaEnv, false);
    }
  }

  return result;
}

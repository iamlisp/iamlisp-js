import mergeArgs from "./mergeArgs";
import evaluate from "./evaluate";
import Env from "../Env";
import LambdaCall from "../types/LambdaCall";

export default function invokeLambda(lambda, argValues, strict = true) {
  const frame = mergeArgs(lambda.args, argValues);

  let result = new LambdaCall(lambda, frame);

  if (strict) {
    while (result instanceof LambdaCall) {
      const lambdaEnv = new Env(result.frame, result.lambda.env);
      result = evaluate(result.lambda.body, lambdaEnv, false);
    }
  }

  return result;
}

import mergeArgs from "./mergeArgs";
import evaluate from "./evaluate";
import Env from "../Env";

export default function invokeLambda(lambda, argValues) {
  const mergedArguments = mergeArgs(lambda.args, argValues);
  const lambdaEnv = new Env(mergedArguments, lambda.env);

  return evaluate(lambda.body, lambdaEnv);
}

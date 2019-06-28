import Env from "./Env";
import print from "./printer/print";
import evaluate from "./evaluator/evaluate";
import parse from "./parser/parse";

export default function createEvaluator() {
  const env = new Env();
  return code => print(evaluate(parse(code), env));
}

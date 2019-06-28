import Env from "./Env";
import print from "./printer/print";
import evaluate from "./evaluator/evaluate";
import parse from "./parser/parse";
import importModule from "./evaluator/importModule";
import { resolve } from "path";

export default function createEvaluator() {
  const env = new Env();

  importModule(env, resolve("./exts/index.iamlisp"));

  return code => print(evaluate(parse(code), env));
}

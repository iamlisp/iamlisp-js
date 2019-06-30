import { resolve } from "path";
import Env from "./Env";
import print from "./printer/print";
import evaluate from "./evaluator/evaluate";
import parse from "./parser/parse";
import importModule from "./evaluator/importModule";
import getAppDir from "./helpers/getAppDir";

export default function createEvaluator() {
  const env = new Env();

  importModule(env, resolve(getAppDir(), "../exts/index.iamlisp"));

  return code => print(evaluate(parse(code), env));
}

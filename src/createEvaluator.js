import { resolve } from "path";
import Env from "./Env";
import print from "./printer/print";
import evaluate from "./evaluator/evaluate";
import parse from "./parser/parse";
import importModule from "./evaluator/importModule";
import getAppDir from "./helpers/getAppDir";
import evaluatorContext from "./evaluator/evaluatorContext";

function withOptions(options, fn) {
  return evaluatorContext.runAndReturn(() => {
    evaluatorContext.set("options", options);
    return fn();
  });
}

export default function createEvaluator(options) {
  const env = new Env();

  withOptions(options, () => {
    importModule(env, resolve(getAppDir(), "../exts/index.iamlisp"));
  });

  return code => {
    const optionsWithStartTime = { ...options, startTime: Date.now() };
    return withOptions(optionsWithStartTime, () => {
      const parsedTree = parse(code);
      const result = evaluate(parsedTree, env, true);
      return print(result);
    });
  };
}

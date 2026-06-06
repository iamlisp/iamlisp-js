import { resolve } from "path";
import print from "./printer/print";
import evaluate from "./evaluator/evaluate";
import evaluateIterative from "./evaluator/evaluateIterative";
import parse from "./parser/parse";
import importModule from "./evaluator/importModule";
import getAppDir from "./helpers/getAppDir";
import evaluatorContext from "./evaluator/evaluatorContext";
import Env from "./evaluator/env/Env";

function withOptions(options, fn) {
  return evaluatorContext.runAndReturn(() => {
    evaluatorContext.set("options", options);
    return fn();
  });
}

export default function createEvaluator(options) {
  options = options || {};
  const env = new Env();

  env.set("__modulePath", process.cwd());

  withOptions(options, () => {
    importModule(env, resolve(getAppDir(), "../exts/index.iamlisp"));
  });

  return code => {
    const optionsWithStartTime = { ...options, startTime: Date.now() };
    return withOptions(optionsWithStartTime, () => {
      const parsedTree = parse(code);
      const evaluator = options.mode === "recursive" ? evaluate : evaluateIterative;
      const result = evaluator(parsedTree, env, true);
      return print(result);
    });
  };
}

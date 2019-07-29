import { isEmpty } from "lodash";
import SpecialForm from "../../../types/SpecialForm";
import Env from "../../env/Env";
import evaluate from "../../evaluate";
import mergeArgs from "../../mergeArgs";
import splitDefinition from "../../helpers/splitDefinitions";
import evaluateArgumentsNoSpread from "../../helpers/evaluateArgumentsNoSpread";

const loop = new SpecialForm((env, [defs, ...body]) => {
  const [initArgNames, initArgValues] = splitDefinition(defs);

  const recurArgs = [];
  const recur = (...args) => {
    recurArgs.push(args);
  };

  recurArgs.push(evaluateArgumentsNoSpread(initArgValues, env));

  let result;

  while (!isEmpty(recurArgs)) {
    const innerEnv = new Env({ recur }, env);
    const argValues = recurArgs.shift();
    const mergedArgs = mergeArgs(initArgNames, argValues);
    innerEnv.merge(mergedArgs);
    result = evaluate(body, innerEnv);
  }

  return result;
});

export default loop;

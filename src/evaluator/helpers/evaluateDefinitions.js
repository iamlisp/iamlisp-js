import { size } from "lodash";
import { evaluateExpression } from "../evaluate";
import mergeArgs from "../mergeArgs";

const isEven = n => n % 2 === 0;

export default function evaluateDefinitions(env, defs) {
  const argNames = [];
  const argValues = [];

  for (let i = 0; i < size(defs); i += 1) {
    const def = defs[i];
    if (isEven(i)) {
      argNames.push(def);
    } else {
      argValues.push(evaluateExpression(def, env));
    }
  }

  const mergedArgs = mergeArgs(argNames, argValues);

  env.merge(mergedArgs);
}

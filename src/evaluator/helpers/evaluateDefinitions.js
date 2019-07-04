import { size } from "lodash";
import { evaluateExpression } from "../evaluate";
import mergeArgs from "../mergeArgs";

const isEven = n => n % 2 === 0;

export default function evaluateDefinitions(env, defs, options = {}) {
  let argName;
  let argValue;

  for (let i = 0; i < size(defs); i += 1) {
    const def = defs[i];
    if (isEven(i)) {
      argName = def;
    } else {
      argValue = evaluateExpression(def, env);
      const mergedArgs = mergeArgs([argName], [argValue]);
      env.merge(mergedArgs, options.redef === true);
    }
  }
}

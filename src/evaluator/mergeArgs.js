import { isEmpty, size } from "lodash";
import Symbl from "../types/Symbl";

/**
 * Merge argument names with values.

 * @param {Symbl[]} argNames 
 * @param {*[]} argValues 
 */
export default function mergeArgs(argNames, argValues) {
  const diff = size(argValues) - size(argNames);

  if (diff < 0) {
    throw new Error("Not enough arguments");
  }

  let values;
  if (diff > 0) {
    const bucketedArgs = diff + 1;
    const lastArgValue = argValues.slice(-bucketedArgs);
    const firstArgsValues = argValues.slice(0, -bucketedArgs);
    values = [...firstArgsValues, lastArgValue];
  } else {
    values = [...argValues];
  }

  let args = {};

  for (const argName of argNames) {
    if (isEmpty(values)) {
      throw new Error("Not enough arguments");
    }

    if (argName instanceof Symbl) {
      args[argName.name] = values.shift();
    } else {
      throw new Error(`Wrong type of argument - ${typeof argName}`);
    }
  }

  return args;
}

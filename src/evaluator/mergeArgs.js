import { isEmpty } from "lodash";
import Symbl from "../types/Symbl";

const REST_PREFIX = "*";

function isRestSymbol(expr) {
  return expr instanceof Symbl && expr.name[0] === REST_PREFIX;
}
/**
 * Merge argument names with values.

 * @param {string[]} argsNames 
 * @param {*[]} argValues 
 */
export default function mergeArgs(argsNames, argValues) {
  if (!Array.isArray(argValues)) {
    throw new Error(`Wrong type of argument list`);
  }

  let afterRest = false;
  let values = [...argValues];
  let args = {};

  for (const argName of argsNames) {
    if (isEmpty(values)) {
      throw new Error("Not enough arguments");
    }

    if (afterRest) {
      throw new Error("Rest argument should be the last");
    }

    if (Array.isArray(argName)) {
      Object.assign(args, mergeArgs(argName, values.shift()));
    } else if (isRestSymbol(argName)) {
      const restSymbolName = argName.name.slice(1);
      args[restSymbolName] = [new Symbl("list"), ...values];
      afterRest = true;
    } else if (argName instanceof Symbl) {
      args[argName.name] = values.shift();
    } else {
      throw new Error(`Wrong type of argument - ${typeof argName}`);
    }
  }

  return args;
}

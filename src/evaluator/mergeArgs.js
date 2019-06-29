import { isEmpty } from "lodash";
import Symbl from "../types/Symbl";

const REST_PREFIX = "*";

function isRestSymbol(expr) {
  return expr instanceof Symbl && expr.name[0] === REST_PREFIX;
}

function getRestSymbolName(expr) {
  return expr.name.slice(1);
}

export default function mergeArgs(argNameSymbols, argValues) {
  if (!Array.isArray(argValues)) {
    throw new Error(`Wrong type of argument list`);
  }

  let afterRest = false;
  let values = [...argValues];
  let args = {};

  for (const argNameSymbol of argNameSymbols) {
    if (isEmpty(values)) {
      throw new Error("Not enough arguments");
    }

    if (afterRest) {
      throw new Error("Rest argument should be the last");
    }

    if (Array.isArray(argNameSymbol)) {
      Object.assign(args, mergeArgs(argNameSymbol, values.shift()));
    } else if (isRestSymbol(argNameSymbol)) {
      const restSymbolName = getRestSymbolName(argNameSymbol);
      args[restSymbolName] = [new Symbl("list"), ...values];
      afterRest = true;
    } else if (argNameSymbol instanceof Symbl) {
      args[argNameSymbol.name] = values.shift();
    } else {
      throw new Error(`Wrong type of argument - ${typeof argNameSymbol}`);
    }
  }

  return args;
}

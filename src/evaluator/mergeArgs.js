import { isEmpty } from "lodash";
import Symbl from "../types/Symbl";
import DotPunctuator from "../types/DotPunctuator";

export default function mergeArgs(argNames, argValues) {
  let afterDot = false;

  if (!Array.isArray(argValues)) {
    throw new Error(`Wrong type of argument list`);
  }

  let values = [...argValues];
  let args = {};

  for (const argName of argNames) {
    if (argName instanceof DotPunctuator) {
      afterDot = true;
      continue;
    }

    if (afterDot) {
      if (Array.isArray(argName)) {
        throw new Error("Could not use destructuring after dot");
      }
      if (argName instanceof Symbl) {
        args[argName.name] = values;
        break;
      }
    }

    if (isEmpty(values)) {
      throw new Error("Not enough arguments");
    }

    if (Array.isArray(argName)) {
      Object.assign(args, mergeArgs(argName, values.shift()));
    } else if (argName instanceof Symbl) {
      args[argName.name] = values.shift();
    } else {
      throw new Error(`Wrong type of argument - ${typeof argName}`);
    }
  }

  return args;
}

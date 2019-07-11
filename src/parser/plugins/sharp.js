import { first, nth, flatMap, max, range } from "lodash";
import Symbl from "../../types/Symbl";
import DotPunctuator from "../../types/DotPunctuator";

function getAllReferences(xs) {
  return flatMap(xs, x => {
    if (Array.isArray(x)) {
      return getAllReferences(x);
    }
    if (x instanceof Symbl && x.name.match(/%\d*/)) {
      return [x.name];
    }
    return [];
  });
}

function replaceVariables(xs, replacements) {
  if (Array.isArray(xs)) {
    return xs.map(x => replaceVariables(x, replacements));
  }

  if (xs instanceof Symbl && xs.name in replacements) {
    return replacements[xs.name];
  }

  return xs;
}

export default function withSharp(expr) {
  if (!Array.isArray(expr)) {
    return expr;
  }

  if (!(first(expr) instanceof Symbl) || first(expr).name !== "sharp") {
    return expr;
  }

  if (!Array.isArray(nth(expr, 1))) {
    throw new TypeError(`Bad sharp body expression`);
  }

  const body = nth(expr, 1);
  const referencedVars = getAllReferences(body);

  const maxReferencedIndex = max(
    referencedVars.map(variable => Number(variable.slice(1)) || 1)
  );

  const newBody = replaceVariables(body, { "%": new Symbl("%1") });
  const args = range(0, maxReferencedIndex).map(i => new Symbl(`%${i + 1}`));
  const argsWithRest = [...args, new DotPunctuator(), new Symbl("%&")];

  return [new Symbl("lambda"), argsWithRest, newBody];
}

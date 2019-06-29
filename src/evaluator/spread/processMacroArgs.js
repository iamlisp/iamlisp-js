import DotPunctuator from "../../types/DotPunctuator";

export default function processMacroArgs(args) {
  let results = [];
  let afterDot = false;

  for (const arg of args) {
    if (arg instanceof DotPunctuator) {
      afterDot = true;
      continue;
    }

    if (afterDot) {
      if (Array.isArray(arg)) {
        results.push(...arg);
      } else {
        throw new Error("Could not spread non-list value");
      }
      afterDot = false;
    } else {
      results.push(arg);
    }
  }

  return results;
}

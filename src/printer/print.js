import { entries } from "lodash";
import Symbl from "../types/Symbl";
import Macro from "../types/Macro";
import Lambda from "../types/Lambda";

export default function print(exp) {
  if (typeof exp === "string") {
    return `"${exp.replace('"', '\\"')}"`;
  }
  if (exp instanceof Symbl) {
    return exp.name;
  }
  if (Array.isArray(exp)) {
    return `(${exp.map(print).join(" ")})`;
  }
  if (exp instanceof Macro) {
    return `(macro ${print(exp.args)} ${exp.body.map(print).join(" ")})`;
  }
  if (exp instanceof Lambda) {
    return `(lambda ${print(exp.args)} ${exp.body.map(print).join(" ")})`;
  }
  if (typeof exp === "object") {
    return `{${entries(exp)
      .map(([key, value]) => `${print(key)} ${print(value)}`)
      .join(" ")}}`;
  }
  return exp;
}

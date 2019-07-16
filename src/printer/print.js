import Symbl from "../types/Symbl";
import Macro from "../types/Macro";
import Lambda from "../types/Lambda";
import DotPunctuator from "../types/DotPunctuator";
import MethodCall from "../types/MethodCall";
import { punctuators } from "../parser/chars";
import LambdaCall from "../types/LambdaCall";
import { List } from "../List";
import Keyword from "../types/Keyword";
import printKeyword from "./printKeyword";

export default function print(exp) {
  if (typeof exp === "string") {
    return `"${exp.replace('"', '\\"')}"`;
  }
  if (exp instanceof Keyword) {
    return printKeyword(exp);
  }
  if (exp instanceof Map) {
    return `{${[...exp.entries()]
      .map(([key, value]) => `${print(key)} ${print(value)}`)
      .join(" ")}}`;
  }
  if (exp instanceof Symbl) {
    return exp.name;
  }
  if (exp === null) {
    return "null";
  }
  if (
    Array.isArray(exp) &&
    exp[0] instanceof Symbl &&
    exp[0].name === "quote"
  ) {
    return `'${print(exp[1])}`;
  }
  if (
    Array.isArray(exp) &&
    exp[0] instanceof Symbl &&
    exp[0].name === "with-meta"
  ) {
    return `^${print(exp[1])} ${print(exp[2])}`;
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
  if (exp instanceof DotPunctuator) {
    return punctuators.DOT;
  }
  if (exp instanceof MethodCall) {
    return `${punctuators.DOT}${exp.name}`;
  }
  if (exp instanceof LambdaCall) {
    return `#LambdaCall`;
  }
  if (exp instanceof List) {
    if (exp.empty) {
      return "Nil";
    }

    const items = [];
    let list = exp;
    while (!list.empty) {
      items.push(list.head);
      list = list.tail;
    }

    return `(${items.map(print).join(" ")})`;
  }

  return exp;
}

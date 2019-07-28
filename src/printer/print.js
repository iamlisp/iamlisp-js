import printKeyword from "./printKeyword";
import printMultiMethod from "./printMultiMethod";
import printString from "./printString";
import printMap from "./printMap";
import printSymbol from "./printSymbol";
import printNull from "./printNull";
import printQuote from "./printQuote";
import printMeta from "./printMeta";
import printArray from "./printArray";
import printMacro from "./printMacro";
import printLambda from "./printLambda";
import printMethodCall from "./printMethodCall";
import printList from "./printList";
import Symbl from "../types/Symbl";
import Macro from "../types/Macro";
import Lambda from "../types/Lambda";
import DotPunctuator from "../types/DotPunctuator";
import { punctuators } from "../parser/chars";
import MultiMethod from "../types/MultiMethod";
import Keyword from "../types/Keyword";
import MethodCall from "../types/MethodCall";
import LambdaCall from "../types/LambdaCall";
import { List } from "../List";

export default function print(exp) {
  if (typeof exp === "string") {
    return printString(exp);
  }
  if (exp instanceof Keyword) {
    return printKeyword(exp);
  }
  if (exp instanceof MultiMethod) {
    return printMultiMethod(exp);
  }
  if (exp instanceof Map) {
    return printMap(exp);
  }
  if (exp instanceof Symbl) {
    return printSymbol(exp);
  }
  if (exp === null) {
    return printNull();
  }
  if (
    Array.isArray(exp) &&
    exp[0] instanceof Symbl &&
    exp[0].name === "quote"
  ) {
    return printQuote(exp);
  }
  if (
    Array.isArray(exp) &&
    exp[0] instanceof Symbl &&
    exp[0].name === "with-meta"
  ) {
    return printMeta(exp);
  }
  if (Array.isArray(exp)) {
    return printArray(exp);
  }
  if (exp instanceof Macro) {
    return printMacro(exp);
  }
  if (exp instanceof Lambda) {
    return printLambda(exp);
  }
  if (exp instanceof DotPunctuator) {
    return punctuators.DOT;
  }
  if (exp instanceof MethodCall) {
    return printMethodCall(exp);
  }
  if (exp instanceof LambdaCall) {
    return `#LambdaCall`;
  }
  if (exp instanceof List) {
    return printList(exp);
  }

  return exp;
}

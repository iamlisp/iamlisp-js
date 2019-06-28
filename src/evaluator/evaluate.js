import { createNamespace } from "continuation-local-storage";
import invokeLambda from "./invokeLambda";
import invokeMethod from "./invokeMethod";
import invokeFunction from "./invokeFunction";
import specialForms from "./specialForms";
import invokeMacro from "./invokeMacro";
import { getJavascriptGlobal } from "./interop";
import Symbl from "../types/Symbl";
import MethodCall from "../types/MethodCall";
import Lambda from "../types/Lambda";
import Macro from "../types/Macro";
import SpecialForm from "../types/SpecialForm";

export const runtimeNs = createNamespace("runtime");

function evaluateList(exprs, env) {
  if (exprs.length === 0) {
    return [];
  }

  const [head, ...tail] = exprs;
  const headForm = evaluateExpression(head, env);

  if (headForm instanceof SpecialForm) {
    return headForm.perform(env, tail);
  }

  if (headForm instanceof Lambda) {
    const evaledArgs = tail.map(arg => evaluateExpression(arg, env));
    return invokeLambda(headForm, evaledArgs);
  }

  if (headForm instanceof Macro) {
    return invokeMacro(headForm, tail, env);
  }

  if (headForm instanceof MethodCall) {
    const [obj, ...args] = tail.map(exp => evaluateExpression(exp, env));
    return invokeMethod(headForm, env, obj, args);
  }

  if (typeof headForm === "function") {
    const args = tail.map(exp => evaluateExpression(exp, env));
    return invokeFunction(headForm, env, args);
  }

  throw new Error(`Cound not execute - ${headForm}`);
}

function evaluateSymbol({ name }, env) {
  if (name in specialForms) {
    return specialForms[name];
  }
  if (name[0] === ".") {
    return new MethodCall(name.substr(1));
  }
  if (name.substr(0, 3) === "js/") {
    return getJavascriptGlobal(name.substr(3));
  }
  return env.get(name);
}

export function evaluateExpression(expr, env) {
  return runtimeNs.runAndReturn(() => {
    if (expr instanceof Symbl) {
      return evaluateSymbol(expr, env);
    }
    if (Array.isArray(expr)) {
      return evaluateList(expr, env);
    }
    return expr;
  });
}

export default function evaluate(exprs, env) {
  return exprs.reduce(
    (result, expr) => evaluateExpression(expr, env),
    undefined
  );
}

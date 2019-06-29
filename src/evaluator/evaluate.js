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
import DotPunctuator from "../types/DotPunctuator";
import evaluateArgs from "./spread/evaluateArgs";

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
    return invokeLambda(headForm, evaluateArgs(tail, env));
  }

  if (headForm instanceof Macro) {
    return invokeMacro(headForm, tail, env);
  }

  if (headForm instanceof MethodCall) {
    const [obj, ...args] = evaluateArgs(tail);
    return invokeMethod(headForm, env, obj, args);
  }

  if (typeof headForm === "function") {
    return invokeFunction(headForm, env, evaluateArgs(tail, env));
  }

  throw new Error(`${headForm} is not callable`);
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
    let resExpr;

    if (expr instanceof Symbl) {
      resExpr = evaluateSymbol(expr, env);
    } else if (Array.isArray(expr)) {
      resExpr = evaluateList(expr, env);
    } else if (expr instanceof DotPunctuator) {
      throw new Error("Syntax error");
    } else {
      resExpr = expr;
    }

    return resExpr;
  });
}

export default function evaluate(exprs, env) {
  return exprs.reduce(
    (result, expr) => evaluateExpression(expr, env),
    undefined
  );
}

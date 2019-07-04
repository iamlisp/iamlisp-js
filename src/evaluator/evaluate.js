import { isEmpty } from "lodash";
import styles from "ansi-styles";
import invokeLambda from "./invokeLambda";
import invokeMethod from "./invokeMethod";
import invokeFunction from "./invokeFunction";
import specialForms from "./specialForms";
import invokeMacro from "./invokeMacro";
import { getJavascriptGlobal } from "./interop";
import evaluateArgs from "./spread/evaluateArgs";
import evaluatorContext from "./evaluatorContext";
import Symbl from "../types/Symbl";
import MethodCall from "../types/MethodCall";
import Lambda from "../types/Lambda";
import Macro from "../types/Macro";
import SpecialForm from "../types/SpecialForm";
import DotPunctuator from "../types/DotPunctuator";
import print from "../printer/print";

function evaluateList(exprs, env, strict) {
  const stackDepth = (evaluatorContext.get("stackDepth") || 0) + 1;
  evaluatorContext.set("stackDepth", stackDepth);
  const stackPadding = " ".repeat(stackDepth);

  const { debug } = evaluatorContext.get("options");

  if (debug) {
    // eslint-disable-next-line no-console
    console.log(
      `${styles.gray.open}>${stackPadding}${print(exprs)}${styles.gray.close}`
    );
  }

  let result = [];

  if (!isEmpty(exprs)) {
    const [head, ...tail] = exprs;
    const headForm = evaluateExpression(
      head,
      env,
      isEmpty(tail) ? strict : true
    );

    if (headForm instanceof SpecialForm) {
      result = headForm.perform(env, tail, strict);
    } else if (headForm instanceof Lambda) {
      result = invokeLambda(headForm, evaluateArgs(tail, env), strict);
    } else if (headForm instanceof Macro) {
      result = invokeMacro(headForm, tail, env, strict);
    } else if (headForm instanceof MethodCall) {
      const [obj, ...args] = evaluateArgs(tail, env);
      result = invokeMethod(headForm, env, obj, args);
    } else if (typeof headForm === "function") {
      result = invokeFunction(headForm, env, evaluateArgs(tail, env));
    } else {
      throw new Error(`${headForm} is not callable`);
    }
  }

  if (debug) {
    // eslint-disable-next-line no-console
    console.log(
      `${styles.gray.open}<${stackPadding}${print(result)}${styles.gray.close}`
    );
  }

  return result;
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

export function evaluateExpression(expr, env, strict = true) {
  return evaluatorContext.runAndReturn(() => {
    let resExpr;

    if (expr instanceof Symbl) {
      resExpr = evaluateSymbol(expr, env);
    } else if (Array.isArray(expr)) {
      resExpr = evaluateList(expr, env, strict);
    } else if (expr instanceof DotPunctuator) {
      throw new Error("Syntax error");
    } else {
      resExpr = expr;
    }

    return resExpr;
  });
}

export default function evaluate(exprs, env, strict = true) {
  return exprs.reduce(
    (result, expr) => evaluateExpression(expr, env, strict),
    undefined
  );
}

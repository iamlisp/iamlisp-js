import { chunk } from "lodash";
import SpecialForm from "../../types/SpecialForm";
import { evaluateExpression } from "../evaluate";
import Lambda from "../../types/Lambda";
import Macro from "../../types/Macro";
import mergeArgs from "../mergeArgs";
import Symbl from "../../types/Symbl";
import expand from "../expand";
import createObject from "../createObject";
import DotPunctuator from "../../types/DotPunctuator";
import evaluateArgs from "../spread/evaluateArgs";

const langForms = {
  cons: new SpecialForm((env, [arg, list]) => {
    const evaluatedList = evaluateExpression(list, env);
    const evaluatedArg = evaluateExpression(arg, env);
    return [evaluatedArg, ...evaluatedList];
  }),
  eval: new SpecialForm((env, exprs) => {
    const evaluatedExprs = evaluateArgs(exprs, env);
    return evaluatedExprs.reduce(
      (prevResult, expr) => evaluateExpression(expr, env),
      undefined
    );
  }),
  apply: new SpecialForm((env, [fn, args]) => {
    return evaluateExpression([fn, ...args], env);
  }),
  concat: new SpecialForm((env, exprs) => {
    return exprs.reduce((list, expr) => {
      list.push(...evaluateExpression(expr, env));
      return list;
    }, []);
  }),
  begin: new SpecialForm((env, exprs) => {
    return exprs.reduce(
      (prevResult, expr) => evaluateExpression(expr, env),
      undefined
    );
  }),
  lambda: new SpecialForm((env, [args, ...body]) => {
    if (
      !Array.isArray(args) ||
      args.some(
        arg => !(arg instanceof Symbl) && !(arg instanceof DotPunctuator)
      )
    ) {
      throw new Error("Lambda arguments should be list of symbols");
    }
    return new Lambda(args, body, env);
  }),
  macro: new SpecialForm((env, [args, ...body]) => {
    if (
      !Array.isArray(args) ||
      args.some(
        arg => !(arg instanceof Symbl) && !(arg instanceof DotPunctuator)
      )
    ) {
      throw new Error("Macro arguments should be list of symbols");
    }
    return new Macro(args, body);
  }),
  macroexpand: new SpecialForm((env, [$macro, ...args]) => {
    const macro = evaluateExpression($macro, env);
    if (!(macro instanceof Macro)) {
      throw new Error("First argument should be a macro");
    }
    const mergedArgs = mergeArgs(macro.args, args);
    const expandedBody = expand(macro.body, mergedArgs);

    return [new Symbl("begin"), ...expandedBody];
  }),
  def: new SpecialForm((env, args) => {
    chunk(args, 2).forEach(([sym, value]) => {
      if (!(sym instanceof Symbl)) {
        throw new Error("Could not bound value to non-symbol");
      }
      env.set(sym.name, evaluateExpression(value, env));
    });
  }),
  quote: new SpecialForm((env, [arg]) => {
    return arg;
  }),
  list: new SpecialForm((env, args) => {
    return evaluateArgs(args, env);
  }),
  new: new SpecialForm((env, [className, ...args]) => {
    const Class = evaluateExpression(className, env);
    return createObject(Class, env, evaluateArgs(args, env));
  })
};

export default langForms;

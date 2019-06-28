import { chunk } from "lodash";
import SpecialForm from "../../types/SpecialForm";
import { evaluateExpression } from "../evaluate";
import Lambda from "../../types/Lambda";
import Macro from "../../types/Macro";
import mergeArgs from "../mergeArgs";
import Symbl from "../../types/Symbl";
import expand from "../expand";
import createObject from "../createObject";

const langForms = {
  do: new SpecialForm((env, expressions) => {
    return expressions.reduce((prevResult, exp) => {
      return evaluateExpression(exp, env);
    }, undefined);
  }),
  lambda: new SpecialForm((env, [args, ...body]) => {
    if (!Array.isArray(args) || args.some(arg => !(arg instanceof Symbl))) {
      throw new Error("Lambda arguments should be list of symbols");
    }
    return new Lambda(args, body, env);
  }),
  macro: new SpecialForm((env, [args, ...body]) => {
    if (!Array.isArray(args) || args.some(arg => !(arg instanceof Symbl))) {
      throw new Error("Macro arguments should be list of symbols");
    }
    return new Macro(args, body);
  }),
  macroexpand: new SpecialForm((env, [$macro, ...args]) => {
    const macro = evaluateExpression($macro, env);
    if (!(macro instanceof Macro)) {
      throw new Error("First argument should be a macro");
    }
    const argNames = macro.args.map(arg => arg.name);
    const mergedArgs = mergeArgs(argNames, args);
    return [new Symbl("do"), ...expand(macro.body, mergedArgs)];
  }),
  def: new SpecialForm((env, args) => {
    chunk(args, 2).forEach(([sym, value]) => {
      if (!(sym instanceof Symbl)) {
        throw new Error("Every odd argument should be a symbol");
      }
      env.set(sym.name, evaluateExpression(value, env));
    });
  }),
  quote: new SpecialForm((env, [arg]) => {
    return arg;
  }),
  list: new SpecialForm((env, args) => {
    return args.map(arg => evaluateExpression(arg, env));
  }),
  new: new SpecialForm((env, [className, ...args]) => {
    const Class = evaluateExpression(className, env);
    const resovledArgs = args.map(arg => evaluateExpression(arg, env));
    return createObject(Class, env, resovledArgs);
  })
};

export default langForms;

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
import print from "../../printer/print";
import evaluatorContext from "../evaluatorContext";

export const metaSymbol = Symbol("meta");

const langForms = {
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
  begin: new SpecialForm((env, exprs, strict) => {
    return exprs.reduce(
      (prevResult, expr) => evaluateExpression(expr, env, strict),
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
  quote: new SpecialForm((env, [arg]) => {
    return arg;
  }),
  array: new SpecialForm((env, args) => {
    return evaluateArgs(args, env);
  }),
  new: new SpecialForm((env, [className, ...args]) => {
    const Class = evaluateExpression(className, env);
    return createObject(Class, env, evaluateArgs(args, env));
  }),
  print: new SpecialForm((env, args) => {
    const { printFn } = evaluatorContext.get("options");
    // eslint-disable-next-line no-console
    printFn(
      args
        .map(arg => evaluateExpression(arg, env))
        .map(print)
        .join(" ")
    );
  }),
  meta: new SpecialForm((env, [argument, metadata]) => {
    const evaledArgument = evaluateExpression(argument, env);
    const evaledMetadata = evaluateExpression(metadata, env);
    evaledArgument[metaSymbol] = evaledMetadata;
    return evaledArgument;
  })
};

export default langForms;

import SpecialForm from "../../types/SpecialForm";
import { evaluateExpression } from "../evaluate";

const binOp = (op, evaluate, args) => args.map(evaluate).reduce(op);
const binCmp = (cmp, evaluate, args) => {
  let leftOperand = evaluate(args.shift());
  while (args.length > 0) {
    const rightOperand = evaluate(args.shift());
    if (!cmp(leftOperand, rightOperand)) {
      return false;
    }
    leftOperand = rightOperand;
  }
  return true;
};

const binOpForms = {
  "+": new SpecialForm((env, args) =>
    binOp((x, y) => x + y, exp => evaluateExpression(exp, env), args)
  ),
  "*": new SpecialForm((env, args) =>
    binOp((x, y) => x * y, exp => evaluateExpression(exp, env), args)
  ),
  "-": new SpecialForm((env, args) =>
    binOp((x, y) => x - y, exp => evaluateExpression(exp, env), args)
  ),
  "/": new SpecialForm((env, args) =>
    binOp((x, y) => x / y, exp => evaluateExpression(exp, env), args)
  ),
  "%": new SpecialForm((env, args) =>
    binOp((x, y) => x % y, exp => evaluateExpression(exp, env), args)
  ),

  pow: new SpecialForm((env, args) =>
    binOp((x, y) => Math.pow(x, y), exp => evaluateExpression(exp, env), args)
  ),
  sqrt: new SpecialForm((env, args) =>
    binOp((x, y) => Math.sqrt(x, y), exp => evaluateExpression(exp, env), args)
  ),

  max: new SpecialForm((env, args) =>
    binOp((x, y) => Math.max(x, y), exp => evaluateExpression(exp, env), args)
  ),
  min: new SpecialForm((env, args) =>
    binOp((x, y) => Math.min(x, y), exp => evaluateExpression(exp, env), args)
  ),

  ">": new SpecialForm((env, args) =>
    binCmp((x, y) => x > y, exp => evaluateExpression(exp, env), args)
  ),
  "<": new SpecialForm((env, args) =>
    binCmp((x, y) => x < y, exp => evaluateExpression(exp, env), args)
  ),
  ">=": new SpecialForm((env, args) =>
    binCmp((x, y) => x >= y, exp => evaluateExpression(exp, env), args)
  ),
  "<=": new SpecialForm((env, args) =>
    binCmp((x, y) => x <= y, exp => evaluateExpression(exp, env), args)
  ),
  "=": new SpecialForm((env, args) =>
    binCmp((x, y) => x === y, exp => evaluateExpression(exp, env), args)
  ),
  "!=": new SpecialForm((env, args) =>
    binCmp((x, y) => x !== y, exp => evaluateExpression(exp, env), args)
  ),

  or: new SpecialForm((env, args) => {
    for (const arg of args) {
      const value = evaluateExpression(arg, env);
      if (value) {
        return value;
      }
    }
    return false;
  }),

  and: new SpecialForm((env, args) => {
    for (const arg of args) {
      const value = evaluateExpression(arg, env);
      if (!value) {
        return false;
      }
    }
    return true;
  }),

  not: new SpecialForm((env, [arg]) => {
    return !evaluateExpression(arg, env);
  })
};

export default binOpForms;

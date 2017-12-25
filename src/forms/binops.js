const SpecialForm = require('./SpecialForm');

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
}

module.exports = {
  '+': new SpecialForm((env, evaluate, args) => binOp((x, y) => x + y, exp => evaluate(exp, env), args)),
  '*': new SpecialForm((env, evaluate, args) => binOp((x, y) => x * y, exp => evaluate(exp, env), args)),
  '-': new SpecialForm((env, evaluate, args) => binOp((x, y) => x - y, exp => evaluate(exp, env), args)),
  '/': new SpecialForm((env, evaluate, args) => binOp((x, y) => x / y, exp => evaluate(exp, env), args)),

  'pow': new SpecialForm((env, evaluate, args) => binOp((x, y) => Math.pow(x, y), exp => evaluate(exp, env), args)),
  'sqrt': new SpecialForm((env, evaluate, args) => binOp((x, y) => Math.sqrt(x, y), exp => evaluate(exp, env), args)),

  'max': new SpecialForm((env, evaluate, args) => binOp((x, y) => Math.max(x, y), exp => evaluate(exp, env), args)),
  'min': new SpecialForm((env, evaluate, args) => binOp((x, y) => Math.min(x, y), exp => evaluate(exp, env), args)),

  '>': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x > y, exp => evaluate(exp, env), args)),
  '<': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x < y, exp => evaluate(exp, env), args)),
  '>=': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x >= y, exp => evaluate(exp, env), args)),
  '<=': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x <= y, exp => evaluate(exp, env), args)),
  '=': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x === y, exp => evaluate(exp, env), args)),
  '!=': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x !== y, exp => evaluate(exp, env), args)),

  'or': new SpecialForm((env, evaluate, args) => {
    for (const arg of args) {
      const value = evaluate(arg, env);
      if (value) {
        return value;
      }
    }
    return false;
  }),

  'and': new SpecialForm((env, evaluate, args) => {
    for (const arg of args) {
      const value = evaluate(arg, env);
      if (!value) {
        return false;
      }
    }
    return true;
  }),

  'not': new SpecialForm((env, evaluate, [arg]) => {
    return !evaluate(arg, env);
  }),
};

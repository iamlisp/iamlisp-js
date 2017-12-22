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

  '>': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x > y, exp => evaluate(exp, env), args)),
  '<': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x < y, exp => evaluate(exp, env), args)),
  '>=': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x >= y, exp => evaluate(exp, env), args)),
  '<=': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x <= y, exp => evaluate(exp, env), args)),
  '=': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x === y, exp => evaluate(exp, env), args)),
  '!=': new SpecialForm((env, evaluate, args) => binCmp((x, y) => x !== y, exp => evaluate(exp, env), args)),
};

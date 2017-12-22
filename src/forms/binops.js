const SpecialForm = require('./SpecialForm');

const binOp = (op, evaluate, args) => args.map(evaluate).reduce(op);

module.exports = {
  '+': new SpecialForm((env, evaluate, args) => binOp((x, y) => x + y, evaluate, args)),
  '*': new SpecialForm((env, evaluate, args) => binOp((x, y) => x * y, evaluate, args)),
  '-': new SpecialForm((env, evaluate, args) => binOp((x, y) => x - y, evaluate, args)),
  '/': new SpecialForm((env, evaluate, args) => binOp((x, y) => x / y, evaluate, args)),
};

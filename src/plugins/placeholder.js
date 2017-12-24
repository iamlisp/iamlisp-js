const size = require('lodash/size');
const Symbol = require('../Symbol');

const PLACEHOLDER = '_';

const makeLambda = (args, expr) => [new Symbol('lambda'), args, expr];

module.exports = (expr) => {
  if (!Array.isArray(expr)) {
    return expr;
  }

  const args = [];

  const newExpr = expr.map(x => {
    if (x instanceof Symbol && x.name === PLACEHOLDER) {
      const argName = new Symbol(`__${size(args)}`);
      args.push(argName);
      return argName;
    }
    return x;
  });

  return size(args) > 0 ? makeLambda(args, newExpr) : newExpr;
};

const { size, head } = require('lodash');
const Symbol = require('../Symbol');

const PIPE = '->';
const COMPOSE = '<-';

const expandPipe = (xs) => {
  const arg = new Symbol('__arg')
  return [
    new Symbol('lambda'),
    [arg],
    xs.reduce((acc, expr) => [expr, acc], arg),
  ];
};

module.exports = (expr) => {
  if (
    Array.isArray(expr) &&
    head(expr) instanceof Symbol &&
    head(expr).name === PIPE
  ) {
    return expandPipe(expr.slice(1));
  }

  if (
    Array.isArray(expr) &&
    head(expr) instanceof Symbol &&
    head(expr).name === COMPOSE
  ) {
    return expandPipe(expr.slice(1).reverse());
  }

  return expr;
};

const { size, head, tail, omit } = require('lodash');
const Symbol = require('../Symbol');

function isExpression(expr) {
  return Array.isArray(expr);
}

function isSymbol(name, symbol) {
  return symbol instanceof Symbol && symbol.name === name;
}

function isShadingExpression(expr) {
  return isExpression(expr)
    && size(expr) > 0
    && (
      isSymbol('lambda', head(expr))
      || isSymbol('macro', head(expr))
    );
};

function isDefExpression(expr) {
  return isExpression(expr) && size(expr) == 3 && isSymbol('def', head(expr));
}

function reduceExpression([acc, args], expr) {
  if (isDefExpression(expr)) {
    const shadowedSymbol = head(tail(expr));
    const newArgs = omit(args, shadowedSymbol.name);
    return [[...acc, expand(expr, newArgs)], newArgs];
  }

  if (isShadingExpression(expr)) {
    const argNames = head(tail(expr)).map(arg => arg.name);
    const newArgs = omit(args, argNames);
    return [[...acc, expand(expr, newArgs)], args];
  }

  return [[...acc, expand(expr, args)], args];
}

/**
 * Substitudes arguments into expression and returns new expression.
 * 
 * @param {Object} expr
 * @param {Object} args
 * @returns Object
 */
function expand(expr, args) {
  if (isExpression(expr)) {
    return head(expr.reduce(reduceExpression, [[], args]));
  }

  if (expr instanceof Symbol && expr.name in args) {
    return args[expr.name];
  }

  return expr;
}

module.exports = expand;

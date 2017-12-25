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

/**
 * Substitudes arguments into expression and returns new expression.
 * 
 * @param {Object} expr
 * @param {Object} args
 * @returns Object
 */
function expand(expr, args) {
  if (isExpression(expr)) {
    if (isShadingExpression(expr)) {
      const argNames = head(tail(expr)).map(arg => arg.name);
      const filteredArgs = omit(args, argNames);
      return expr.map(x => expand(x, filteredArgs));
    }

    return expr.map(x => expand(x, args));
  }

  if (expr instanceof Symbol && expr.name in args) {
    return args[expr.name];
  }

  return expr;
}

module.exports = expand;

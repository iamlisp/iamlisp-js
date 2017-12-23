const Symbol = require('../Symbol');

module.exports = (expr) => {
  if (!Array.isArray(expr)) {
    return expr;
  }
  const iter = ([head, ...tail], newExpr) => {
    if (head === undefined) {
      return newExpr;
    }
    if (head instanceof Symbol && head.name === "'") {
      const [nextHead, ...nextTail] = tail;
      return iter(nextTail, [...newExpr, [new Symbol('quote'), nextHead]]);
    }
    return iter(tail, [...newExpr, head]);
  };
  return iter(expr, []);
};

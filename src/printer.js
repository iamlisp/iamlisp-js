const Symbol = require('./Symbol');
const Macro = require('./Macro');
const Lambda = require('./Lambda');

const print = (exp) => {
  if (exp instanceof Symbol) {
    return exp.name;
  }
  if (Array.isArray(exp)) {
    return `(${exp.map(print).join(' ')})`;
  }
  if (exp instanceof Macro) {
    return `(macro ${print(exp.args)} ${exp.body.map(print)})`;
  }
  if (exp instanceof Lambda) {
    return `(lambda ${print(exp.args)} ${exp.body.map(print)})`;
  }
  return exp;
};

module.exports = print;

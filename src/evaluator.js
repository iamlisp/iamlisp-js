const Symbol = require('./Symbol');
const parse = require('./parser');
const specialForms = require('./forms');
const SpecialForm = require('./forms/SpecialForm');

class Env {
  constructor(parent) {
    this.map = new Map();
    this.parent = parent;
  }

  set(key, value) {
    this.map.set(key, value);
  }

  get(key) {
    if (this.map.has(key)) {
      return this.map.get(key);
    }

    if (!this.parent) {
      throw new Error(`Symbol ${key} is not bound`);
    }

    return this.parent.get(key);
  }
}

const evaluateSymbol = ({ name }, env) => {
  if (name in specialForms) {
    return specialForms[name];
  }
  return env.get(name);
};

const evaluateList = (list, env) => {
  if (list.length === 0) {
    return [];
  }
  const [head, ...tail] = list;
  const headForm = evaluate(head, env);
  if (headForm instanceof SpecialForm) {
    return headForm.perform(env, evaluate, tail);
  }
  throw new Error('Cound not execute');
};

const evaluate = (expression, env) => {
  if (expression instanceof Symbol) {
    return evaluateSymbol(expression, env);
  }
  if (Array.isArray(expression)) {
    return evaluateList(expression, env);
  }
  if (expression instanceof Map) {
    return evaluateMap(expression, env);
  }
  return expression;
};

module.exports.makeEvaluator = () => {
  const env = new Env();

  env.set('foo', 'boo');

  return (code) => {
    return parse(code).reduce((result, exp) => evaluate(exp, env), undefined);
  };
};

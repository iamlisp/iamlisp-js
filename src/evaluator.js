const Symbol = require('./Symbol');
const Lambda = require('./Lambda');
const Macro = require('./Macro');
const parse = require('./parser');
const specialForms = require('./forms');
const SpecialForm = require('./forms/SpecialForm');
const { mergeArguments } = require('./util');

class Env {
  constructor(map = new Map(), parent) {
    this.map = map;
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

  if (headForm instanceof Lambda) {
    const argNames = headForm.args.map(arg => arg.name);
    const argValues = tail.map(arg => evaluate(arg, env));

    const mergedArguments = mergeArguments(argNames, argValues);
    const lambdaEnv = new Env(mergedArguments, headForm.env);

    return evaluateEach(headForm.body, lambdaEnv);
  }

  if (headForm instanceof Macro) {
    const argNames = headForm.args.map(arg => arg.name);
    const argValues = tail.map(arg => evaluate(arg, env));
    const mergedArguments = mergeArguments(argNames, argValues);

    const expandedBody = headForm.expand(mergedArguments);

    return evaluateEach(expandedBody, env);
  }

  throw new Error(`Cound not execute - ${headForm}`);
};

const evaluateEach = (expressions, env) => {
  return expressions.reduce((result, exp) => {
    env.set('$', result);
    return evaluate(exp, env);
  }, undefined);
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
  return code => evaluateEach(parse(code), env);
};

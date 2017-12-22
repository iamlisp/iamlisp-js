const Symbol = require('./Symbol');
const Lambda = require('./Lambda');
const Macro = require('./Macro');
const parse = require('./parser');
const specialForms = require('./forms');
const SpecialForm = require('./forms/SpecialForm');

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

    return headForm.body.reduce((result, exp) => evaluate(exp, lambdaEnv), undefined);
  }

  if (headForm instanceof Macro) {
    const argNames = headForm.args.map(arg => arg.name);
    const argValues = tail.map(arg => evaluate(arg, env));
    const mergedArguments = mergeArguments(argNames, argValues);

    const expandedBody = expandMacro(mergedArguments, headForm.body);

    return expandedBody.reduce((result, exp) => evaluate(exp, env), undefined);
  }


  throw new Error(`Cound not execute - ${headForm}`);
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

const mergeArguments = (argNames, argValues) => {
  const map = new Map();
  for (let i = 0; i < argNames.length; i += 1) {
    map.set(argNames[i], argValues[i]);
  }
  return map;
};

const expandMacro = (args, body) => {
  if (Array.isArray(body)) {
    return body.map(exp => expandMacro(args, exp));
  }
  if (body instanceof Symbol) {
    if (args.has(body.name)) {
      return args.get(body.name);
    }
  }
  return body;
};

module.exports.makeEvaluator = () => {
  const env = new Env();

  env.set('foo', 'boo');

  return (code) => {
    return parse(code).reduce((result, exp) => evaluate(exp, env), undefined);
  };
};

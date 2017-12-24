const { chunk } = require('lodash');
const SpecialForm = require('./SpecialForm');
const Lambda = require('../Lambda');
const Macro = require('../Macro');
const Symbol = require('../Symbol');
const { mergeArguments, chunkToMap } = require('../util');


module.exports = {
  'lambda': new SpecialForm((env, evaluate, [args, ...body]) => {
    if (!Array.isArray(args) || args.some(arg => !(arg instanceof Symbol))) {
      throw new Error('Lambda arguments should be list of symbols');
    }
    return new Lambda(args, body, env);
  }),
  'macro': new SpecialForm((env, evaluate, [args, ...body]) => {
    if (!Array.isArray(args) || args.some(arg => !(arg instanceof Symbol))) {
      throw new Error('Macro arguments should be list of symbols');
    }
    return new Macro(args, body);
  }),
  'macroexpand': new SpecialForm((env, evaluate, [$macro, ...args]) => {
    const macro = evaluate($macro, env);
    if (!(macro instanceof Macro)) {
      throw new Error('First argument should be a macro');
    }
    const mergedArgs = mergeArguments(macro.args.map(arg => arg.name), args);
    return macro.expand(mergedArgs);
  }),
  'def': new SpecialForm((env, evaluate, args) => {
    const chunks = chunk(args, 2);
    chunks.forEach(([sym, value]) => {
      if (!(sym instanceof Symbol)) {
        throw new Error('Every odd argument should be a symbol');
      }
      env.set(sym.name, evaluate(value, env));
    });
  }),
  'quote': new SpecialForm((env, evaluate, [arg]) => {
    return arg;
  }),
  'list': new SpecialForm((env, evaluate, args) => {
    return args.map(arg => evaluate(arg, env));
  }),
  'map': new SpecialForm((env, evaluate, args) => {
    return chunkToMap(args.map(arg => evaluate(arg, env)));
  }),
  'new': new SpecialForm((env, evaluate, [className, ...args]) => {
    const Class = evaluate(className, env);
    const evaluatedArguments = args.map(arg => evaluate(arg, env));
    return new Class(...evaluatedArguments);
  }),
};

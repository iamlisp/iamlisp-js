const SpecialForm = require('./SpecialForm');
const Lambda = require('../Lambda');
const Macro = require('../Macro');
const Symbol = require('../Symbol');

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
};

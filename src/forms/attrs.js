const SpecialForm = require('./SpecialForm');

module.exports = {
  'has-attr': new SpecialForm((env, evaluate, [obj, name]) => {
    return evaluate(name, env) in evaluate(obj, env);
  }),
  'del-attr': new SpecialForm((env, evaluate, [obj, name]) => {
    delete evaluate(obj, env)[evaluate(name, env)];
  }),
  'get-attr': new SpecialForm((env, evaluate, [obj, name]) => {
    return evaluate(obj, env)[evaluate(name, env)];
  }),
  'set-attr': new SpecialForm((env, evaluate, [obj, name, value]) => {
    evaluate(obj, env)[evaluate(name, env)] = evaluate(value, env);
  }),
};

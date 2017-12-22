const SpecialForm = require('./SpecialForm');

module.exports = {
  '+': new SpecialForm((env, evaluate, args) => args.reduce((acc, arg) => acc + evaluate(arg, env), 0)),
  '-': new SpecialForm((env, evaluate, args) => args.reduce((acc, arg) => acc * evaluate(arg, env), 1)),
};

const Lambda = require('../Lambda');
const Macro = require('../Macro');
const Symbol = require('../Symbol');

function callJSMethod(method, object, args) {
  return object[method].apply(object, castArguments(args));
}

function callJSFunction(func, args) {
  return func.apply(null, castArguments(args));
}

function castArguments(args) {
  return args.map(arg => {
    if (arg instanceof Lambda) {
      return convertLambdaToFunction(arg, env);
    }
    if (arg instanceof Macro) {
      return convertMacroToFunction(arg, env);
    }
    if (arg instanceof Symbol) {
      return arg.name;
    }
    return arg;
  });
}

module.exports = { callJSMethod, callJSFunction };

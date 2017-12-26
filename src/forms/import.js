const { last, find } = require('lodash');
const { readFileSync, existsSync } = require('fs');
const parse = require('../parser');
const { pipe } = require('../util');
const Env = require('../Env');
const Symbol = require('../Symbol');
const SpecialForm = require('./SpecialForm');

const moduleLocations = name => [
  `${process.cwd()}/${name}.iamlisp`,
  `${__dirname}/../../exts/${name}.iamlisp`,
];

module.exports = {
  'import': new SpecialForm((env, evaluate, [path, nameSymbol]) => {
    const evaluatedPath = evaluate(path, env);

    if (typeof evaluatedPath !== 'string') {
      throw new TypeError('Module path should be a string');
    }

    const locations = moduleLocations(evaluatedPath);
    const modulePath = find(locations, existsSync);

    if (modulePath === undefined) {
      throw new Error(`Module "${evaluatedPath}" does not exist`);
    }

    const moduleExpr = pipe([path => readFileSync(path, 'UTF-8'), parse])(modulePath);

    if (nameSymbol === undefined) {
      return last(moduleExpr.map(expr => evaluate(expr, env)));
    }
    
    if (nameSymbol instanceof Symbol) {
      const moduleEnv = new Env({}, env);
      const lastResult = last(moduleExpr.map(expr => evaluate(expr, moduleEnv)));
      env.import(moduleEnv, nameSymbol.name);
      return lastResult;
    }

    throw new TypeError('Module name should be a symbol');
  }),
};
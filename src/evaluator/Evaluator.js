const { startsWith } = require('lodash');
const Env = require('../Env');
const parse = require('../parser');
const specialForms = require('./forms');
const SpecialForm = require('./forms/SpecialForm');

const MethodCall = require('../MethodCall');
const Symbol = require('../Symbol');
const Lambda = require('../Lambda');
const Macro = require('../Macro');

const invokeFunction = require('./invokeFunction');
const invokeMethod = require('./invokeMethod');
const invokeLambda = require('./invokeLambda');
const invokeMacro = require('./invokeMacro');

module.exports = class Evaluator {
  constructor() {
    this.evaluateExpression = this.evaluateExpression.bind(this);

    this.env = new Env();
    this.importCoreModule();
  }

  importCoreModule() {
    this.importModule('std');
  }

  evaluateCode(code) {
    return this.evaluateExpr(parse(code));
  }

  evaluateExpression(expr) {
    if (expression instanceof Symbol) {
      return this._evaluateSymbol(expression);
    }
    if (Array.isArray(expression)) {
      return this._evaluateList(expression);
    }
    return expression;
  }

  importModule(module, name) {
    const importModule = this.env.get('import');
    return importModule(module, name);
  }

  _evaluateSymbol({ name }) {
    if (name in specialForms) {
      return specialForms[name];
    }
    if (startsWith('.', name)) {
      return new MethodCall(name.substr(1));
    }
    if (startsWith('js/', name)) {
      return this._getJS(name.substr(3));
    }
    return this.env.get(name);
  }

  _evaluateList(list) {
    if (list.length === 0) {
      return [];
    }

    const [head, ...args] = list;
    const headForm = this.evaluateExpression(head);

    if (headForm instanceof SpecialForm) {
      return headForm.perform(this, args);
    }

    if (typeof headForm === 'function') {
      return invokeFunction(headForm, evaluatedArgs, this);
    }

    if (headForm instanceof Lambda) {
      return invokeLambda(headForm, args, this);
    }

    if (headForm instanceof Macro) {
      return invokeMacro(headForm, args, this);
    }

    if (headForm instanceof MethodCall) {
      const [obj, ...methodArgs] = args;
      return invokeMethod(headForm, obj, methodArgs, this);
    }

    throw new Error(`Cound not apply ${headForm}`);
  }

  _getJS(name) {
    if (typeof global === 'object') {
      return global[name];
    }
    if (typeof window === 'object') {
      return window[name];
    }
    throw new Error('Unknown environment');
  }
}

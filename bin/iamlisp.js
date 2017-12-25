#!/usr/bin/env node

const { size } = require('lodash');
const styles = require('ansi-styles');
const { pipe } = require('../src/util');
const { readFileSync } = require('fs');
const { createInterface } = require('readline');
const { version } = require('../package.json');
const parse = require('../src/parser');
const evaluate = require('../src/evaluator').makeEvaluator();
const print = require('../src/printer');

const readFile = file => readFileSync(file, 'UTF-8');
const parseCode = code => parse(code);
const evalExpr = expr => evaluate(expr);
const printResult = result => console.log(`${styles.green.open}${print(result)}${styles.green.close}`);
const printError = err => console.error(err);

const startRepl = async () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stderr,
    terminal: true,
  });
  
  const readCode = () => new Promise((resolve => {
    rl.question('> ', input => resolve(input));
  }));
  
  console.log('I Am Lisp Interpreter. Version %s', version);

  while (true) {
    await Promise.resolve()
      .then(readCode)
      .then(parseCode)
      .then(evalExpr)
      .then(printResult)
      .catch(printError);
  }
};

const evaluateFile = pipe([readFile, parseCode, evalExpr]);

if (size(process.argv) >= 3) {
  evaluateFile(process.argv[2]);
} else {
  startRepl();
}

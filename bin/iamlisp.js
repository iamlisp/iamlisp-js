const { createInterface } = require('readline');
const { version } = require('../package.json');
const parse = require('../src/parser');
const evaluate = require('../src/evaluator').makeEvaluator();
const print = require('../src/printer');

const rl = createInterface({
  input: process.stdin,
  output: process.stderr,
  terminal: true,
});

const readCode = () => new Promise((resolve => {
  rl.question('> ', input => resolve(input));
}));

const evalCode = (code) => evaluate(code);

const printResult = (result) => console.log(print(result));

const printError = (err) => console.error(err);

const iter = () => {
  Promise.resolve()
    .then(readCode)
    .then(evalCode)
    .then(printResult)
    .catch(printError)
    .then(iter);
};

console.log('I Am Lisp Interpreter. Version %s', version);

iter();

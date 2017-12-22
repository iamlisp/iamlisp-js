const parse = require('./src/parser');
const evaluate = require('./src/evaluator').makeEvaluator();

console.log(parse('hello world'));
console.log(parse('hello\\ world'));
console.log(parse('(hello world)'));
console.log(parse('{ hello world }'));

console.log(evaluate('foo'));
console.log(evaluate('(+ 1 2 3)'));

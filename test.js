const parse = require('./src/parser');
const evaluate = require('./src/evaluator').makeEvaluator();

console.log(parse('hello world'));
console.log(parse('hello\\ world'));
console.log(parse('(hello world)'));
console.log(parse('{ hello world }'));

console.log(evaluate('foo'));
console.log(evaluate('(+ 1 2 3)'));
console.log(evaluate('(< 1 2 3)'));
console.log(evaluate('(> 1 2 3)'));
console.log(evaluate('(or 1 2)'));
console.log(evaluate('(or 0 12)'));
console.log(evaluate('(not true)'));
console.log(evaluate('((lambda (x y) (+ x y)) 2 3)'));
console.log(evaluate('((macro (x y) (+ x y)) 2 3)'));

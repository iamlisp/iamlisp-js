const parse = require('./src/parser');
const evaluate = require('./src/evaluator').makeEvaluator();
const print = require('./src/printer');

console.log(parse('hello world'));
console.log(parse('hello\\ world'));
console.log(parse('(hello world)'));
console.log(parse('{ hello world }'));

console.log(evaluate('(+ 1 2 3)'));
console.log(evaluate('(< 1 2 3)'));
console.log(evaluate('(> 1 2 3)'));
console.log(evaluate('(or 1 2)'));
console.log(evaluate('(or 0 12)'));
console.log(evaluate('(not true)'));
console.log(evaluate('((lambda (x y) (+ x y)) 2 3)'));
console.log(print(evaluate('(macro (x y) (+ x y))')));
console.log(evaluate('(def hello 12) hello'));

console.log(print(evaluate('((+ _ 2) 3)')));
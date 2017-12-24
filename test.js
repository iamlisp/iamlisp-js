const parse = require('./src/parser');
const evaluate = require('./src/evaluator').makeEvaluator();
const print = require('./src/printer');

const debug = {
  parse: code => `${code} => ${parse(code).map(print).join(' ')}`,
};

console.log(debug.parse('foo'));
console.log(debug.parse('true 47 3.14'));

console.log(debug.parse('"foo" "foo \\" bar"'));

console.log(debug.parse('(foo)'));
console.log(debug.parse('(foo bar)'));
console.log(debug.parse('(foo bar) (baz bass)'));
console.log(debug.parse("'foo"));
console.log(debug.parse("'(1 2 3)"));
console.log(debug.parse("' (1 2 3)"));

// console.log(evaluate('(+ 1 2 3)'));
// console.log(evaluate('(< 1 2 3)'));
// console.log(evaluate('(> 1 2 3)'));
// console.log(evaluate('(or 1 2)'));
// console.log(evaluate('(or 0 12)'));
// console.log(evaluate('(not true)'));
// console.log(evaluate('((lambda (x y) (+ x y)) 2 3)'));
// console.log(print(evaluate('(macro (x y) (+ x y))')));
// console.log(evaluate('(def hello 12) hello'));

// console.log(print(evaluate('((+ _ 2) 3)')));
// console.log(print(evaluate("(list 1 2 3)")));

const assert = require('assert');

const parse = require('../src/parser');
const evaluate = require('../src/evaluator').makeEvaluator();
const print = require('../src/printer');

const debug = {
  parse: code => parse(code).map(print).join(' '),
  eval: code => print(evaluate(parse(code))),
};

// Parser tests
assert.equal(debug.parse('foo'), 'foo');
assert.equal(debug.parse('true 47 3.14'), 'true 47 3.14');

assert.equal(debug.parse('"foo" "foo \\" bar"'), '"foo" "foo \\" bar"');
assert.equal(debug.parse('(foo)'), '(foo)');
assert.equal(debug.parse('(foo bar)'), '(foo bar)');
assert.equal(debug.parse('(foo bar) (baz bass)'), '(foo bar) (baz bass)');

assert.equal(debug.parse("'foo"), '(quote foo)');
assert.equal(debug.parse("'(1 2 3)"), '(quote (1 2 3))');
assert.equal(debug.parse("' (1 2 3)"), '(quote (1 2 3))');

// Parser plugins tests
assert.equal(debug.parse('(* _ 2)'), '(lambda (__0) (* __0 2))');
assert.equal(debug.parse('(-> foo bar baz)'), '(lambda (__arg) (baz (bar (foo __arg))))');
assert.equal(debug.parse('(<- foo bar baz)'), '(lambda (__arg) (foo (bar (baz __arg))))');
// assert.equal(debug.parse('{ "foo": "bar" }'), '{ "foo": "bar" }');

// Evaluator tests
// Math operations
assert.equal(debug.eval('(+ 1 2 3)'), 6);
assert.equal(debug.eval('(- 6 2 3)'), 1);
assert.equal(debug.eval('(* 2 3 4)'), 24);
assert.equal(debug.eval('(/ 24 3 2)'), 4);

// Logical operations
assert.equal(debug.eval('(< 1 2 3)'), true);
assert.equal(debug.eval('(< 1 2 0)'), false);
assert.equal(debug.eval('(> 1 2 3)'), false);

assert.equal(debug.eval('(or true true)'), true);
assert.equal(debug.eval('(or true false)'), true);
assert.equal(debug.eval('(or false true)'), true);
assert.equal(debug.eval('(or false false)'), false);

assert.equal(debug.eval('(and true true)'), true);
assert.equal(debug.eval('(and true false)'), false);
assert.equal(debug.eval('(and false true)'), false);
assert.equal(debug.eval('(and false false)'), false);

assert.equal(debug.eval('(not true)'), false);
assert.equal(debug.eval('(not false)'), true);

// Definition
assert.equal(debug.eval('(def hello 12) hello'), 12);

// Lambda application
assert.equal(debug.eval('((lambda (x y) (+ x y)) 2 3)'), 5);
assert.equal(debug.eval('((lambda (x y) (+ x y)) 2 3)'), 5);

// List constructor
assert.equal(debug.eval('(list 1 2 3)'), '(1 2 3)');

// Placeholders
assert.equal(debug.eval('((+ _ 1) 2)'), 3);

assert.equal(debug.eval("(.map '(1 2 3) (* _ 2))"), '(2 4 6)');
assert.equal(debug.eval("(.map '(1 2 3) (macro (x) (* x 2)))"), '(2 4 6)');
assert.equal(debug.eval('(macroexpand (macro (x) (* x 3)) 2)'), '(do (* 2 3))');

assert.equal(debug.eval('(import "std")'), '"OK"');
assert.equal(debug.eval('((lambda (x y) (+ x y)) 1)'), '(lambda (y) (+ 1 y))');

assert.equal(debug.eval(`
  (def f (lambda (x y z)
    x
    (lambda (x) (* 2 x))
    y
    (def y (+ y 99))
    y
    z))
  (f 1 2)
`), '(lambda (z) 1 (lambda (x) (* 2 x)) 2 (def y (+ 2 99)) y z)');

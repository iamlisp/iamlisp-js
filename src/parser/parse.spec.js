import parse from "./parse";
import Symbl from "../types/Symbl";

// Test parser
test.each`
  input                            | output
  ${"foo"}                         | ${[new Symbl("foo")]}
  ${"foo bar"}                     | ${[new Symbl("foo"), new Symbl("bar")]}
  ${'"hello" 123 true false null'} | ${["hello", 123, true, false, null]}
  ${'"\\"1\\""'}                   | ${[`"1"`]}
  ${"(list 1 2 3 4)"}              | ${[[new Symbl("list"), 1, 2, 3, 4]]}
  ${"(+ 1 2 (- 10 5))"}            | ${[[new Symbl("+"), 1, 2, [new Symbl("-"), 10, 5]]]}
  ${"(+ 1 2) (- 10 5)"}            | ${[[new Symbl("+"), 1, 2], [new Symbl("-"), 10, 5]]}
  ${`{foo 1 "bar" 2}`}             | ${[{ foo: 1, bar: 2 }]}
`('Should correclty parse "$input"', ({ input, output }) => {
  expect(parse(input)).toEqual(output);
});

// Test plugin "pipe"
test.each`
  input             | output
  ${"(-> foo bar)"} | ${[[new Symbl("lambda"), [new Symbl("__arg")], [new Symbl("bar"), [new Symbl("foo"), new Symbl("__arg")]]]]}
  ${"(<- foo bar)"} | ${[[new Symbl("lambda"), [new Symbl("__arg")], [new Symbl("foo"), [new Symbl("bar"), new Symbl("__arg")]]]]}
`('Should correclty parse "$input" with plugin "pipe"', ({ input, output }) => {
  expect(parse(input)).toEqual(output);
});

// Test plugin "placeholder"
test.each`
  input          | output
  ${"(+ _ _ _)"} | ${[[new Symbl("lambda"), [new Symbl("__0"), new Symbl("__1"), new Symbl("__2")], [new Symbl("+"), new Symbl("__0"), new Symbl("__1"), new Symbl("__2")]]]}
  ${"(- _ _)"}   | ${[[new Symbl("lambda"), [new Symbl("__0"), new Symbl("__1")], [new Symbl("-"), new Symbl("__0"), new Symbl("__1")]]]}
`(
  'Should correclty parse "$input" with plugin "placeholder"',
  ({ input, output }) => {
    expect(parse(input)).toEqual(output);
  }
);

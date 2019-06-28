import parse from "./parse";
import Symbl from "../types/Symbl";

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

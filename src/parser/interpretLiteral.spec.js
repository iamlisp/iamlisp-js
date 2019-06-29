import interpretLiteral from "./interpretLiteral";

test.each`
  input      | output
  ${"true"}  | ${[true, true]}
  ${"false"} | ${[true, false]}
  ${"10"}    | ${[true, 10]}
  ${"3.14"}  | ${[true, 3.14]}
  ${"-123"}  | ${[true, -123]}
  ${"null"}  | ${[true, null]}
  ${"foo"}   | ${[false, undefined]}
  ${"3.1.4"} | ${[false, undefined]}
`(`Should return $output when input "$input"`, ({ input, output }) => {
  expect(interpretLiteral(input)).toEqual(output);
});

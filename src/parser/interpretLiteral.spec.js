import interpretLiteral from "./interpretLiteral";

test.each`
  input      | output
  ${"true"}  | ${{ interpreted: true, literal: true }}
  ${"false"} | ${{ interpreted: true, literal: false }}
  ${"10"}    | ${{ interpreted: true, literal: 10 }}
  ${"3.14"}  | ${{ interpreted: true, literal: 3.14 }}
  ${"-123"}  | ${{ interpreted: true, literal: -123 }}
  ${"null"}  | ${{ interpreted: true, literal: null }}
  ${"foo"}   | ${{ interpreted: false, literal: undefined }}
  ${"3.1.4"} | ${{ interpreted: false, literal: undefined }}
`(`Should return $output when input "$input"`, ({ input, output }) => {
  expect(interpretLiteral(input)).toEqual(output);
});

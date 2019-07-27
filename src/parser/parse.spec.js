import { first } from "lodash";
import parse from "./parse";
import Symbl from "../types/Symbl";
import DotPunctuator from "../types/DotPunctuator";
import Keyword from "../types/Keyword";

test.each`
  type                         | input                      | output
  ${"symbol"}                  | ${"foo"}                   | ${new Symbl("foo")}
  ${"integer"}                 | ${"1234"}                  | ${1234}
  ${"negative integer"}        | ${"-1234"}                 | ${-1234}
  ${"float"}                   | ${"12.34"}                 | ${12.34}
  ${"negative float"}          | ${"-12.34"}                | ${-12.34}
  ${"exponential number"}      | ${"10e-4"}                 | ${0.001}
  ${"boolean:true"}            | ${"true"}                  | ${true}
  ${"boolean:false"}           | ${"false"}                 | ${false}
  ${"undefined"}               | ${"undefined"}             | ${undefined}
  ${"null"}                    | ${"null"}                  | ${null}
  ${"keyword"}                 | ${":kw"}                   | ${Keyword.for("kw")}
  ${"string"}                  | ${'"eeny meeny miny moe"'} | ${"eeny meeny miny moe"}
  ${"empty list"}              | ${"()"}                    | ${[]}
  ${"list with content"}       | ${"(1 2 (3 4 5))"}         | ${[1, 2, [3, 4, 5]]}
  ${"empty array"}             | ${"[]"}                    | ${[]}
  ${"empty map"}               | ${"{}"}                    | ${new Map()}
  ${"map with keyword as key"} | ${'{:foo "bar"}'}          | ${new Map([[Keyword.for("foo"), "bar"]])}
  ${"map with string as key"}  | ${'{"foo" "bar"}'}         | ${new Map([["foo", "bar"]])}
  ${"map with symbol as key"}  | ${'{foo "bar"}'}           | ${new Map([[new Symbl("foo"), "bar"]])}
  ${"quoted expression"}       | ${"'(1 2 3)"}              | ${[new Symbl("quote"), [1, 2, 3]]}
  ${"expression with meta"}    | ${'^{:foo "bar"}(1 2 3)'}  | ${[new Symbl("with-meta"), new Map([[Keyword.for("foo"), "bar"]]), [1, 2, 3]]}
  ${"empty inline lambda"}     | ${"#()"}                   | ${[new Symbl("lambda"), [DotPunctuator.INSTANCE, new Symbl("%&")], []]}
  ${"inline lambda"}           | ${"#(/ (+ %1 %2) 2)"}      | ${[new Symbl("lambda"), [new Symbl("%1"), new Symbl("%2"), DotPunctuator.INSTANCE, new Symbl("%&")], [new Symbl("/"), [new Symbl("+"), new Symbl("%1"), new Symbl("%2")], 2]]}
  ${"comment"}                 | ${";comment anything"}     | ${undefined}
`("Should currectly parse $input as $type", ({ input, output }) => {
  expect(first(parse(input))).toEqual(output);
});

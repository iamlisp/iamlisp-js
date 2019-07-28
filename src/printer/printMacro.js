import print from "./print";

export default function printMacro(macro) {
  return `(macro ${print(macro.args)} ${macro.body.map(print).join(" ")})`;
}

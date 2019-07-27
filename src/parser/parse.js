import createReader from "./reader";
import readProgram from "./readers/readProgram";

export default function parse(expr) {
  const reader = createReader(expr);
  return readProgram(reader);
}

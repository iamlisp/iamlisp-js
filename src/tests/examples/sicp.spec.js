import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import createEvaluator from "../../createEvaluator";

const examplesDirectory = resolve(__dirname, "../../../docs/examples/sicp");
const examples = readdirSync(examplesDirectory)
  .filter(file => file.endsWith(".iamlisp"))
  .sort();

describe("SICP concept path", () => {
  test.each(examples)("%s executes", file => {
    const code = readFileSync(resolve(examplesDirectory, file), "utf8");
    const evaluate = createEvaluator({ printFn: () => {}, timeout: 30000 });

    expect(() => evaluate(code)).not.toThrow();
  });
});

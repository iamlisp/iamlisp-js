import { createInterface } from "readline";
import styles from "ansi-styles";
import Env from "../Env";
import parse from "../parser/parse";
import evaluate from "../evaluator/evaluate";
import print from "../printer/print";

const printResult = result => {
  // eslint-disable-next-line no-console
  console.log(`${styles.green.open}${print(result)}${styles.green.close}`);
};

const printError = err => {
  // eslint-disable-next-line no-console
  console.error(err);
};

const startRepl = async () => {
  const env = new Env();

  const rl = createInterface({
    input: process.stdin,
    output: process.stderr,
    terminal: true
  });

  const readExpr = () =>
    new Promise(resolve => {
      rl.question("> ", input => resolve(input));
    });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await Promise.resolve()
      .then(readExpr)
      .then(exprStr => parse(exprStr))
      .then(expr => evaluate(expr, env))
      .then(printResult)
      .catch(printError);
  }
};

startRepl().catch(() => {
  process.exit(1);
});

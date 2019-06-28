import { createInterface } from "readline";
import styles from "ansi-styles";
import createEvaluator from "../createEvaluator";

const printResult = result => {
  // eslint-disable-next-line no-console
  console.log(`${styles.green.open}${result}${styles.green.close}`);
};

const printError = err => {
  // eslint-disable-next-line no-console
  console.error(err);
};

const startRepl = async () => {
  const evaluate = createEvaluator();

  const rl = createInterface({
    input: process.stdin,
    output: process.stderr,
    terminal: true
  });

  const readRawExpr = () =>
    new Promise(resolve => {
      rl.question("> ", input => resolve(input));
    });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await Promise.resolve()
      .then(readRawExpr)
      .then(rawExpr => evaluate(rawExpr))
      .then(printResult)
      .catch(printError);
  }
};

startRepl().catch(err => {
  printError(err);
  process.exit(1);
});

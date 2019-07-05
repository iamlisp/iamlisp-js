import { createInterface } from "readline";
import styles from "ansi-styles";
import createEvaluator from "../createEvaluator";
import calcBalance from "../parser/calcBalance";

const printResult = result => {
  // eslint-disable-next-line no-console
  console.log(`${styles.green.open}${result}${styles.green.close}`);
};

const printError = err => {
  // eslint-disable-next-line no-console
  console.log(`${styles.red.open}${err}${styles.red.close}`);
};

const startRepl = async () => {
  // eslint-disable-next-line no-console
  const evaluate = createEvaluator({ printFn: console.log, debug: true });

  const rl = createInterface({
    input: process.stdin,
    output: process.stderr,
    terminal: true
  });

  const readRawExpr = () =>
    new Promise(resolve => {
      let buffer = "";

      const read = () => {
        rl.question(buffer ? ". " : "> ", input => {
          buffer += input;
          const balance = calcBalance(buffer);
          if (balance > 0) {
            read();
          } else {
            resolve(buffer);
          }
        });
      };

      read();
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

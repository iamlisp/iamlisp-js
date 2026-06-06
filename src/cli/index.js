import { createInterface } from "readline";
import styles from "../terminalStyles";
import createEvaluator from "../createEvaluator";
import calcBalance from "../parser/helpers/calcBalance";

const printResult = result => {
  console.log(`${styles.green.open}${result}${styles.green.close}`);
};

const printError = err => {
  console.log(`${styles.red.open}${err.stack}${styles.red.close}`);
};

const startRepl = async () => {
  const evaluate = createEvaluator({ printFn: console.log, debug: false });

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

import { chars } from "../chars";

export default function calcBalance(exprStr) {
  let balance = 0;

  for (const char of exprStr) {
    if (char === chars.LEFT_PAREN || char === chars.LEFT_BRACKET) {
      balance += 1;
    }
    if (char === chars.RIGHT_PAREN || char === chars.RIGHT_BRACKET) {
      balance -= 1;
    }
  }

  return balance;
}

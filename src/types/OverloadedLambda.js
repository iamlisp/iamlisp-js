import { size, some } from "lodash";
import DotPunctuator from "./DotPunctuator";

export default class OverloadedLambda {
  constructor() {
    this.variants = {};
  }

  addVariant(lambda) {
    if (some(lambda.args, it => it instanceof DotPunctuator)) {
      throw new TypeError(
        "Multi-arity lambda could not be used as variants inside overloaded lambdas"
      );
    }

    const argumentsQty = size(lambda.args);
    this.variants[argumentsQty] = lambda;
  }

  getVariant(argumentsCount) {
    if (!(argumentsCount in this.variants)) {
      throw new TypeError(
        `Overloaded lambda doesn't contain variant for given number of arguments - ${argumentsCount}`
      );
    }
    return this.variants[argumentsCount];
  }
}

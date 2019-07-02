import { chunk, size, head } from "lodash";
import SpecialForm from "../../types/SpecialForm";
import { evaluateExpression } from "../evaluate";

const logicalForms = {
  cond: new SpecialForm((env, args, strict) => {
    const pairs = chunk(args, 2);
    for (const pair of pairs) {
      if (size(pair) === 1) {
        return evaluateExpression(head(pair), env, strict);
      }
      const [cond, expr] = pair;
      if (evaluateExpression(cond, env, true)) {
        return evaluateExpression(expr, env, strict);
      }
    }
    return undefined;
  })
};

export default logicalForms;

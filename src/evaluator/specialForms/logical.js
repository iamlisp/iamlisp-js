import { chunk, size, head } from "lodash";
import SpecialForm from "../../types/SpecialForm";
import { evaluateExpression } from "../evaluate";

const logicalForms = {
  cond: new SpecialForm((env, args) => {
    const pairs = chunk(args, 2);
    for (const pair of pairs) {
      if (size(pair) === 1) {
        return evaluateExpression(head(pair), env);
      }
      const [cond, expr] = pair;
      if (evaluateExpression(cond, env)) {
        return evaluateExpression(expr, env);
      }
    }
    return undefined;
  })
};

export default logicalForms;

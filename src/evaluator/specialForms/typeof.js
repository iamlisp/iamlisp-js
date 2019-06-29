import { evaluateExpression } from "../evaluate";
import SpecialForm from "../../types/SpecialForm";
import Lambda from "../../types/Lambda";
import Macro from "../../types/Macro";
import Symbl from "../../types/Symbl";

const typeofForms = {
  typeof: new SpecialForm((env, [expr]) => {
    const evaluatedExpr = evaluateExpression(expr, env);
    if (evaluatedExpr instanceof Lambda) {
      return "Lambda";
    }
    if (evaluatedExpr instanceof Macro) {
      return "Macro";
    }
    if (evaluatedExpr instanceof Symbl) {
      return "Symbl";
    }
    if (Array.isArray(evaluatedExpr)) {
      return "List";
    }
    return `js:${typeof evaluatedExpr}`;
  })
};

export default typeofForms;

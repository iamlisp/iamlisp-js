import { evaluateExpression } from "../evaluate";
import SpecialForm from "../../types/SpecialForm";
import Lambda from "../../types/Lambda";
import Macro from "../../types/Macro";
import Symbl from "../../types/Symbl";
import { List } from "../../List";

const typeofForms = {
  typeof: new SpecialForm((env, [expr]) => {
    const evaluatedExpr = evaluateExpression(expr, env);
    if (evaluatedExpr === null) {
      return "Null";
    }
    if (evaluatedExpr === undefined) {
      return "Undefined";
    }
    if (evaluatedExpr instanceof Lambda) {
      return "Lambda";
    }
    if (evaluatedExpr instanceof Macro) {
      return "Macro";
    }
    if (evaluatedExpr instanceof Symbl) {
      return "Symbol";
    }
    if (evaluatedExpr instanceof List) {
      return "List";
    }
    if (Array.isArray(evaluatedExpr)) {
      return "Array";
    }
    if (typeof evaluatedExpr === "string") {
      return "String";
    }
    if (typeof evaluatedExpr === "number") {
      return "Number";
    }
    if (
      typeof evaluatedExpr === "object" &&
      evaluatedExpr.constructor.name === "Object"
    ) {
      return "Map";
    }
    return typeof evaluatedExpr;
  })
};

export default typeofForms;

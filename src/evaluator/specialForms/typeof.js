import { evaluateExpression } from "../evaluate";
import SpecialForm from "../../types/SpecialForm";
import Lambda from "../../types/Lambda";
import Macro from "../../types/Macro";
import Symbl from "../../types/Symbl";
import { List } from "../../types/List";
import MultiMethod from "../../types/MultiMethod";

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
    if (typeof evaluatedExpr === "boolean") {
      return "Boolean";
    }
    if (evaluatedExpr instanceof Map) {
      return "Map";
    }
    if (evaluatedExpr instanceof MultiMethod) {
      return "MultiMethod";
    }
    return typeof evaluatedExpr;
  })
};

export default typeofForms;

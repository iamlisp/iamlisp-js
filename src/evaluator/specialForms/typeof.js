import { evaluateExpression } from "../evaluate";
import SpecialForm from "../../types/SpecialForm";
import Lambda from "../../types/Lambda";
import Macro from "../../types/Macro";
import Symbl from "../../types/Symbl";
import { List } from "../../List";
import { metaSymbol } from "./lang";

const typeofForms = {
  typeof: new SpecialForm((env, [expr]) => {
    const evaluatedExpr = evaluateExpression(expr, env);
    if (
      typeof evaluatedExpr === "object" &&
      metaSymbol in evaluatedExpr &&
      "$type" in evaluatedExpr[metaSymbol]
    ) {
      return evaluatedExpr[metaSymbol]["$type"];
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
      return "Object";
    }
    return `js:${typeof evaluatedExpr}`;
  })
};

export default typeofForms;

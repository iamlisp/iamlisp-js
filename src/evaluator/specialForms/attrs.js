import SpecialForm from "../../types/SpecialForm";
import { evaluateExpression } from "../evaluate";

const attrForms = {
  "has-attr": new SpecialForm((env, [obj, name]) => {
    return evaluateExpression(name, env) in evaluateExpression(obj, env);
  }),
  "del-attr": new SpecialForm((env, [obj, name]) => {
    delete evaluateExpression(obj, env)[evaluateExpression(name, env)];
  }),
  "get-attr": new SpecialForm((env, [obj, name]) => {
    return evaluateExpression(obj, env)[evaluateExpression(name, env)];
  }),
  "set-attr": new SpecialForm((env, [obj, name, value]) => {
    evaluateExpression(obj, env)[
      evaluateExpression(name, env)
    ] = evaluateExpression(value, env);
  })
};

export default attrForms;

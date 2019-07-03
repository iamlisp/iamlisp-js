import SpecialForm from "../../types/SpecialForm";
import { evaluateExpression } from "../evaluate";

const attrForms = {
  has: new SpecialForm((env, [obj, name]) => {
    return evaluateExpression(name, env) in evaluateExpression(obj, env);
  }),
  delete: new SpecialForm((env, [obj, name]) => {
    delete evaluateExpression(obj, env)[evaluateExpression(name, env)];
  }),
  get: new SpecialForm((env, [obj, name]) => {
    return evaluateExpression(obj, env)[evaluateExpression(name, env)];
  }),
  set: new SpecialForm((env, [obj, name, value]) => {
    evaluateExpression(obj, env)[
      evaluateExpression(name, env)
    ] = evaluateExpression(value, env);
  })
};

export default attrForms;

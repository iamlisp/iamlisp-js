import SpecialForm from "../../types/SpecialForm";
import { evaluateExpression } from "../evaluate";

const attrForms = {
  has: new SpecialForm((env, [name, obj]) => {
    return evaluateExpression(name, env) in evaluateExpression(obj, env);
  }),
  delete: new SpecialForm((env, [name, obj]) => {
    delete evaluateExpression(obj, env)[evaluateExpression(name, env)];
  }),
  get: new SpecialForm((env, [name, obj]) => {
    return evaluateExpression(obj, env)[evaluateExpression(name, env)];
  }),
  set: new SpecialForm((env, [name, value, obj]) => {
    evaluateExpression(obj, env)[
      evaluateExpression(name, env)
    ] = evaluateExpression(value, env);
  })
};

export default attrForms;

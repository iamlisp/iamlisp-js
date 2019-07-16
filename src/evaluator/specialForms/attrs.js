import SpecialForm from "../../types/SpecialForm";
import { evaluateExpression } from "../evaluate";

const attrForms = {
  has: new SpecialForm((env, [name, obj]) => {
    const key = evaluateExpression(name, env);
    const evalObject = evaluateExpression(obj, env);
    if (evalObject instanceof Map) {
      return evalObject.has(key);
    }
    return key in evalObject;
  }),
  delete: new SpecialForm((env, [name, obj]) => {
    const key = evaluateExpression(name, env);
    const evalObject = evaluateExpression(obj, env);
    if (evalObject instanceof Map) {
      evalObject.delete(key);
      return;
    }
    delete evalObject[key];
  }),
  get: new SpecialForm((env, [name, obj]) => {
    const key = evaluateExpression(name, env);
    const evalObject = evaluateExpression(obj, env);
    if (evalObject instanceof Map) {
      return evalObject.get(key);
    }
    return evalObject[key];
  }),
  set: new SpecialForm((env, [name, value, obj]) => {
    const key = evaluateExpression(name, env);
    const evalValue = evaluateExpression(value, env);
    const evalObject = evaluateExpression(obj, env);
    if (evalObject instanceof Map) {
      return evalObject.set(key, evalValue);
    }
    evalObject[key] = evalValue;
  })
};

export default attrForms;

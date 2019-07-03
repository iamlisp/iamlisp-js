import SpecialForm from "../../../types/SpecialForm";
import { evaluateExpression } from "../../evaluate";

const prepend = new SpecialForm((env, [list, arg]) => {
  const evaldList = evaluateExpression(list, env);
  const evaldValue = evaluateExpression(arg, env);
  return evaldList.prepend(evaldValue);
});

export default prepend;

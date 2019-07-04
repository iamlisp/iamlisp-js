import SpecialForm from "../../../types/SpecialForm";
import { evaluateExpression } from "../../evaluate";
import { assertList } from "../../../List";

const prepend = new SpecialForm((env, [list, arg]) => {
  const evaldList = evaluateExpression(list, env);
  assertList(evaldList);
  const evaldValue = evaluateExpression(arg, env);
  return evaldList.prepend(evaldValue);
});

export default prepend;

import SpecialForm from "../../../types/SpecialForm";
import { evaluateExpression } from "../../evaluate";
import { assertList } from "../../../List";

const prepend = new SpecialForm((env, [item, list]) => {
  const evaldList = evaluateExpression(list, env);
  assertList(evaldList);
  const evaldValue = evaluateExpression(item, env);
  return evaldList.prepend(evaldValue);
});

export default prepend;

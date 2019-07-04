import SpecialForm from "../../../types/SpecialForm";
import { evaluateExpression } from "../../evaluate";
import { assertList } from "../../../List";

const tail = new SpecialForm((env, [list]) => {
  const evaldList = evaluateExpression(list, env);
  assertList(evaldList);
  return evaldList.tail;
});

export default tail;

import SpecialForm from "../../../types/SpecialForm";
import { evaluateExpression } from "../../evaluate";
import { assertList } from "../../../List";

const head = new SpecialForm((env, [list]) => {
  const evaldList = evaluateExpression(list, env);
  assertList(evaldList);
  return evaldList.head;
});

export default head;

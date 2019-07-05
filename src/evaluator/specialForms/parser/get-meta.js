import metaSymbol from "./meta-symbol";
import SpecialForm from "../../../types/SpecialForm";
import { evaluateExpression } from "../../evaluate";

const getMeta = new SpecialForm((env, [target]) => {
  const evaledTarget = evaluateExpression(target, env);
  return evaledTarget[metaSymbol];
});

export default getMeta;

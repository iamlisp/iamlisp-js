import SpecialForm from "../../../types/SpecialForm";
import { evaluateExpression } from "../../evaluate";
import metaSymbol from "./meta-symbol";

const withMeta = new SpecialForm((env, [metadata, target]) => {
  const evaledMetadata = evaluateExpression(metadata, env);
  const evaledTarget = evaluateExpression(target, env);
  evaledTarget[metaSymbol] = evaledMetadata;
  return evaledTarget;
});

export default withMeta;

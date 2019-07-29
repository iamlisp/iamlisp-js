import SpecialForm from "../../../types/SpecialForm";
import evaluateDefinitions from "../../helpers/evaluateDefinitions";
import Env from "../../env/Env";
import evaluate from "../../evaluate";

const where = new SpecialForm((env, [defs, ...exprs], strict) => {
  const subEnv = new Env({}, env);
  evaluateDefinitions(subEnv, defs);
  return evaluate(exprs, subEnv, strict);
});

export default where;

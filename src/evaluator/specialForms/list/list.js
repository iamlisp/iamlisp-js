import SpecialForm from "../../../types/SpecialForm";
import { fromArray } from "../../../List";
import evaluateArgumentsNoSpread from "../../helpers/evaluateArgumentsNoSpread";

const list = new SpecialForm((env, args) => {
  const items = evaluateArgumentsNoSpread(args, env);
  return fromArray(items);
});

export default list;

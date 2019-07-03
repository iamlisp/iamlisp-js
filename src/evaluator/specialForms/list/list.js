import SpecialForm from "../../../types/SpecialForm";
import { fromArray } from "../../../List";
import evaluateArgumentsNoSpread from "../../helpers/evaluateArgumentsNoSpread";

const ilist = new SpecialForm((env, args) => {
  const items = evaluateArgumentsNoSpread(args, env);
  return fromArray(items);
});

export default ilist;

import SpecialForm from "../../../types/SpecialForm";
import evaluateDefinitions from "../../helpers/evaluateDefinitions";

const set = new SpecialForm((env, args) => {
  evaluateDefinitions(env, args, { redef: true });
});

export default set;

import SpecialForm from "../../../types/SpecialForm";
import evaluateDefinitions from "../../helpers/evaluateDefinitions";

const def = new SpecialForm((env, args) => {
  evaluateDefinitions(env, args);
});

export default def;

import SpecialForm from "../../../types/SpecialForm";
import evaluateDefinitions from "../../helpers/evaluateDefinitions";

const defa = new SpecialForm((env, args) => {
  evaluateDefinitions(env, args, { evalNames: true });
});

export default defa;

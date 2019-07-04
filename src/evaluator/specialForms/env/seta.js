import SpecialForm from "../../../types/SpecialForm";
import evaluateDefinitions from "../../helpers/evaluateDefinitions";

const seta = new SpecialForm((env, args) => {
  evaluateDefinitions(env, args, { redef: true, evalNames: true });
});

export default seta;

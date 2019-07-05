import SpecialForm from "../../../types/SpecialForm";

const quote = new SpecialForm((env, [arg]) => {
  return arg;
});

export default quote;

import attrForms from "./attrs";
import binOpForms from "./binops";
import langForms from "./lang";

const specialForms = {
  ...langForms,
  ...attrForms,
  ...binOpForms
};

export default specialForms;

import attrForms from "./attrs";
import binOpForms from "./binops";
import langForms from "./lang";
import importForms from "./import";

const specialForms = {
  ...langForms,
  ...attrForms,
  ...binOpForms,
  ...importForms
};

export default specialForms;

import attrForms from "./attrs";
import binOpForms from "./binops";
import langForms from "./lang";
import importForms from "./import";
import typeofForms from "./typeof";
import logicalForms from "./logical";

const specialForms = {
  ...langForms,
  ...attrForms,
  ...binOpForms,
  ...importForms,
  ...typeofForms,
  ...logicalForms
};

export default specialForms;

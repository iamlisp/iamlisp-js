import attrForms from "./attrs";
import binOpForms from "./binops";
import langForms from "./lang";
import importForms from "./import";
import typeofForms from "./typeof";
import logicalForms from "./logical";
import structural from "./structural";
import listForms from "./list";

const specialForms = {
  ...langForms,
  ...attrForms,
  ...binOpForms,
  ...importForms,
  ...typeofForms,
  ...logicalForms,
  ...structural,
  ...listForms
};

export default specialForms;

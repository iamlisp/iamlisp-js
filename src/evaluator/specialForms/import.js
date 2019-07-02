import { resolve, join } from "path";
import { find } from "lodash";
import { existsSync } from "fs";
import { evaluateExpression, evaluatorContext } from "../evaluate";
import importModule from "../importModule";
import Symbl from "../../types/Symbl";
import SpecialForm from "../../types/SpecialForm";

const MODULE_EXTENSION = ".iamlisp";

function resolveModuleFilepath(modulePath) {
  const resolveVariants = [
    `${modulePath}${MODULE_EXTENSION}`,
    join(modulePath, `index${MODULE_EXTENSION}`)
  ];

  const resolvedVariant = find(resolveVariants, existsSync);

  if (typeof resolvedVariant === "undefined") {
    throw new Error(`Could not resolve module - ${modulePath}`);
  }

  return resolvedVariant;
}

const importForms = {
  import: new SpecialForm((env, [path, namespaceExpr]) => {
    const evaluatedPath = evaluateExpression(path, env);
    if (typeof evaluatedPath !== "string") {
      throw new TypeError("Module path should be a string");
    }

    let namespace;
    if (namespaceExpr instanceof Symbl) {
      namespace = namespaceExpr.name;
    } else if (typeof namespaceExpr !== "undefined") {
      throw new Error("Module namespace should be a symbol");
    }

    const currentModulePath =
      evaluatorContext.get("__modulePath") || process.cwd();
    const importModulePath = resolve(currentModulePath, evaluatedPath);

    const resolvedModuleFilepath = resolveModuleFilepath(importModulePath);

    importModule(env, resolvedModuleFilepath, namespace);
  })
};

export default importForms;

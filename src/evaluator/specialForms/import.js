import { resolve, join } from "path";
import { find } from "lodash";
import { existsSync } from "fs";
import { evaluateExpression } from "../evaluate";
import importModule from "../importModule";
import Symbl from "../../types/Symbl";
import SpecialForm from "../../types/SpecialForm";
import { MODULES_ROOT_DIRECTORY } from "../../config";

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
  import: new SpecialForm((env, [path, asSymbol, namespaceStr]) => {
    const evaluatedPath = evaluateExpression(path, env);
    if (typeof evaluatedPath !== "string") {
      throw new TypeError("Module path should be a string");
    }

    let namespace;
    if (asSymbol instanceof Symbl && asSymbol.name === "as") {
      if (typeof namespaceStr !== "string") {
        throw new Error("Module namespace should be of type String");
      }
      namespace = namespaceStr;
    }

    const currentModulePath = env.get("__modulePath");
    const importModulePath = resolve(
      evaluatedPath.startsWith(".")
        ? currentModulePath
        : MODULES_ROOT_DIRECTORY,
      evaluatedPath
    );

    const resolvedModuleFilepath = resolveModuleFilepath(importModulePath);

    importModule(env, resolvedModuleFilepath, namespace);
  })
};

export default importForms;

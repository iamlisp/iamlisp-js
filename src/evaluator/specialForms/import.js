// import { existsSync } from "fs";
// import { evaluateExpression } from "../evaluate";
// import SpecialForm from "../../types/SpecialForm";
// import parse from "../../parser/parse";

// const moduleLocations = name => [
//   `${process.cwd()}/${name}.iamlisp`,
//   `${__dirname}/../../exts/${name}.iamlisp`
// ];

/**
 * 1. Resolve Module Path
 * 2. Parse Module
 * 3. Evaluate Module
 * 4. Cache Module
 */

const importForms = {
  // 'import': new SpecialForm((env, [path, nameSymbol]) => {
  //   const evaluatedPath = evaluateExpression(path, env);
  //   if (typeof evaluatedPath !== 'string') {
  //     throw new TypeError('Module path should be a string');
  //   }
  //   const locations = moduleLocations(evaluatedPath);
  //   const modulePath = find(locations, existsSync);
  //   if (modulePath === undefined) {
  //     throw new Error(`Module "${evaluatedPath}" does not exist`);
  //   }
  //   const moduleCode = readFileSync(modulePath, 'UTF-8');
  //   const parsedModule = parse(moduleCode);
  //   const moduleExpr = pipe([path => readFileSync(path, 'UTF-8'), parse])(modulePath);
  //   if (nameSymbol === undefined) {
  //     return last(moduleExpr.map(expr => evaluate(expr, env)));
  //   }
  //   if (nameSymbol instanceof Symbol) {
  //     const moduleEnv = new Env({}, env);
  //     const lastResult = last(moduleExpr.map(expr => evaluate(expr, moduleEnv)));
  //     env.import(moduleEnv, nameSymbol.name);
  //     return lastResult;
  //   }
  //   throw new TypeError('Module name should be a symbol');
  // }),
};

export default importForms;

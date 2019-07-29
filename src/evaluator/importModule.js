import { readFileSync } from "fs";
import { dirname } from "path";
import evaluate from "./evaluate";
import Env from "./env/Env";
import parse from "../parser/parse";

const moduleCache = {};

export default function importModule(env, moduleFilepath, namespace) {
  if (!(moduleFilepath in moduleCache)) {
    const modulePath = dirname(moduleFilepath);
    const moduleCode = readFileSync(moduleFilepath, "UTF-8");
    const parsedModule = parse(moduleCode);
    const moduleEnv = new Env({ __modulePath: modulePath }, env);

    evaluate(parsedModule, moduleEnv);

    moduleCache[moduleFilepath] = moduleEnv;
  }

  env.import(moduleCache[moduleFilepath], namespace);
}

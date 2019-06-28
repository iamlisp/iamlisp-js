import { readFileSync } from "fs";
import parse from "../parser/parse";
import Env from "../Env";
import evaluate from "./evaluate";

const moduleCache = {};

export default function importModule(env, moduleFilepath, namespace) {
  if (!(moduleFilepath in moduleCache)) {
    const moduleCode = readFileSync(moduleFilepath, "UTF-8");
    const parsedModule = parse(moduleCode);
    const moduleEnv = new Env();

    evaluate(parsedModule, moduleEnv);

    moduleCache[moduleFilepath] = moduleEnv;
  }

  env.import(moduleCache[moduleFilepath], namespace);
}

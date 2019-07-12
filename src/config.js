import { resolve } from "path";
import getAppDir from "./helpers/getAppDir";

export const MODULES_ROOT_DIRECTORY = resolve(getAppDir(), "../exts");

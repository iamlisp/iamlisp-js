import { dirname } from "path";

export default function getAppDir() {
  return dirname(require.main.filename);
}

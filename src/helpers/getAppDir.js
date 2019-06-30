import { resolve } from "path";

export default function getAppDir() {
  return resolve(__dirname, "../");
}

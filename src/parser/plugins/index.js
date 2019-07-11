import withSharp from "./sharp";

const plugins = [withSharp];

export default function withPlugins(expr) {
  return plugins.reduce((acc, plugin) => plugin(acc), expr);
}

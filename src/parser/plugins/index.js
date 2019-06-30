import withPlaceholder from "./placeholder";

const plugins = [withPlaceholder];

export default function withPlugins(expr) {
  return plugins.reduce((acc, plugin) => plugin(acc), expr);
}

import withPipe from "./pipe";
import withPlaceholder from "./placeholder";

const plugins = [withPipe, withPlaceholder];

export default function withPlugins(expr) {
  return plugins.reduce((acc, plugin) => plugin(acc), expr);
}

const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["coverage/", "dist/"]
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      }
    }
  }
];

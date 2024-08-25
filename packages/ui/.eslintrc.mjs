/** @type {import("eslint").Linter.Config} */
export default {
  root: true,
  extends: ["@campaign-tracker/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
};

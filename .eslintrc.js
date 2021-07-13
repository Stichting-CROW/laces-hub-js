const expensive = true;
const errLevel = process.env["ESLINT_STRICT"] ? "error" : "warn";
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
    project: "./tsconfig-eslint.json",
    tsconfigRootDir: ".",
  },
  plugins: ["@typescript-eslint", "jest"],
  rules: {
    ...(expensive ? { "@typescript-eslint/no-floating-promises": errLevel } : {}),
    "no-console": [
      errLevel,
      {
        allow: [
          "time",
          "timeEnd",
          "trace",
          "warn",
          "error",
          "info",
          "groupEnd",
          "group",
          "groupCollapsed",
        ],
      },
    ],
    "jest/no-focused-tests": errLevel,
    "prettier/prettier": [
      errLevel,
      {
        endOfLine: "auto",
      },
    ],
  },
};

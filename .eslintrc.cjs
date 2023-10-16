module.exports = {
  root: true,
  extends: "airbnb-base",
  env: {
    browser: true,
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: "module",
    requireConfigFile: false,
  },
  rules: {
    quotes: "off",
    "no-underscore-dangle": ["off"],
    "no-prototype-builtins": ["off"],
    "no-nested-ternary": ["off"],
    "func-names": "off",
    "max-nested-callbacks": ["warn", 3],
    "operator-linebreak": [
      "error",
      "after",
      { overrides: { "?": "ignore", ":": "ignore" } },
    ],
    "no-unused-vars": ["warn"],
    "nonblock-statement-body-position": [
      "error",
      "beside",
      { overrides: { while: "any", if: "any" } },
    ],
    "arrow-body-style": ["error", "as-needed"],
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        functions: "never",
      },
    ],
    "no-bitwise": ["error", { allow: ["|", "<<", "&"] }],
    "max-len": [
      "error",
      {
        code: 150,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignoreStrings: true,
      },
    ],
    // allow reassigning param
    "no-param-reassign": [2, { props: false }],
    "linebreak-style": ["error", "unix"],
    "import/extensions": [
      "error",
      {
        js: "always",
      },
    ],
  },
};

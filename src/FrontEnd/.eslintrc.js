module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:eslint-comments/recommended",
    "plugin:react/recommended",
    "plugin:jest/recommended",
    "plugin:promise/recommended",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: ["./src/tsconfig.json", "./test/tsconfig-unit.json"],
    jsxFragmentName: "h",
    jsxPragma: "preact",
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest", "promise"],
  rules: {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "eslint-disable-next-line react/react-in-jsx-scope": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
  settings: {
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      {
        property: "freeze",
        object: "Object",
      },
      {
        property: "myFavoriteWrapper",
      },
    ],
    linkComponents: [
      "Hyperlink",
      {
        name: "Link",
        linkAttribute: "to",
      },
    ],
    react: {
      pragma: "h",
      version: "detect",
    },
  },
};

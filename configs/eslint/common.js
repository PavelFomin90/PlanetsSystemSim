const restrictedGlobals = require("confusing-browser-globals");

module.exports = {
  extends: [
    require.resolve("./base"),
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],

  plugins: ["import", "jsx-a11y",  "prettier"],

  overrides: [
    {
      files: ["**/*.ts?(x)"],
      extends: [require.resolve("./ts")],
    },
  ],

  rules: {
    // http://eslint.org/docs/rules/
    "array-callback-return": "warn",
    "default-case": ["warn", { commentPattern: "^no default$" }],
    "dot-location": ["warn", "property"],
    eqeqeq: ["warn", "smart"],
    "new-parens": "warn",
    "no-array-constructor": "warn",
    "no-caller": "warn",
    "no-cond-assign": ["warn", "except-parens"],
    "no-const-assign": "warn",
    "no-control-regex": "warn",
    "no-delete-var": "warn",
    "no-dupe-args": "warn",
    "no-dupe-class-members": "warn",
    "no-dupe-keys": "warn",
    "no-duplicate-case": "warn",
    "no-empty-character-class": "warn",
    "no-empty-pattern": "warn",
    "no-eval": "warn",
    "no-ex-assign": "warn",
    "no-extend-native": "warn",
    "no-extra-bind": "warn",
    "no-extra-label": "warn",
    "no-fallthrough": "warn",
    "no-func-assign": "warn",
    "no-implied-eval": "warn",
    "no-invalid-regexp": "warn",
    "no-iterator": "warn",
    "no-label-var": "warn",
    "no-labels": ["warn", { allowLoop: true, allowSwitch: false }],
    "no-lone-blocks": "warn",
    "no-loop-func": "warn",
    "no-mixed-operators": [
      "warn",
      {
        groups: [
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["&&", "||"],
          ["in", "instanceof"],
        ],
        allowSamePrecedence: false,
      },
    ],
    "no-multi-str": "warn",
    "no-global-assign": "warn",
    "no-unsafe-negation": "warn",
    "no-new-func": "warn",
    "no-new-object": "warn",
    "no-new-symbol": "warn",
    "no-new-wrappers": "warn",
    "no-obj-calls": "warn",
    "no-octal": "warn",
    "no-octal-escape": "warn",
    "no-redeclare": "warn",
    "no-regex-spaces": "warn",
    "no-restricted-syntax": ["warn", "WithStatement"],
    "no-script-url": "warn",
    "no-self-assign": "warn",
    "no-self-compare": "warn",
    "no-sequences": "warn",
    "no-shadow-restricted-names": "warn",
    "no-sparse-arrays": "warn",
    "no-template-curly-in-string": "warn",
    "no-this-before-super": "warn",
    "no-throw-literal": "warn",
    "no-undef": "error",
    "no-restricted-globals": ["error"].concat(restrictedGlobals),
    "no-unreachable": "warn",
    "no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    "no-unused-labels": "warn",
    "no-unused-vars": [
      "warn",
      {
        args: "all",
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
    "no-use-before-define": [
      "warn",
      {
        functions: false,
        classes: false,
        variables: false,
      },
    ],
    "no-useless-computed-key": "warn",
    "no-useless-concat": "warn",
    "no-useless-constructor": "warn",
    "no-useless-escape": "warn",
    "no-useless-rename": [
      "warn",
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],
    "no-with": "warn",
    "no-whitespace-before-property": "warn",
    "require-yield": "warn",
    "rest-spread-spacing": ["warn", "never"],
    strict: ["warn", "never"],
    "unicode-bom": ["warn", "never"],
    "use-isnan": "warn",
    "valid-typeof": "warn",
    "no-restricted-properties": [
      "error",
      {
        object: "require",
        property: "ensure",
        message:
          "Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting",
      },
      {
        object: "System",
        property: "import",
        message:
          "Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting",
      },
    ],
    "getter-return": "warn",

    // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
    "import/no-unresolved": "error",
    "import/first": "error",
    "import/no-amd": "error",
    "import/no-anonymous-default-export": "warn",
    "import/no-webpack-loader-syntax": "error",
    "import/no-default-export": "warn",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index", "type"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: false,
        },
      },
    ],

    // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/anchor-has-content": "warn",
    "jsx-a11y/anchor-is-valid": [
      "warn",
      {
        aspects: ["noHref", "invalidHref"],
      },
    ],
    "jsx-a11y/aria-activedescendant-has-tabindex": "warn",
    "jsx-a11y/aria-props": "warn",
    "jsx-a11y/aria-proptypes": "warn",
    "jsx-a11y/aria-role": ["warn", { ignoreNonDOM: true }],
    "jsx-a11y/aria-unsupported-elements": "warn",
    "jsx-a11y/heading-has-content": "warn",
    "jsx-a11y/iframe-has-title": "warn",
    "jsx-a11y/img-redundant-alt": "warn",
    "jsx-a11y/no-access-key": "warn",
    "jsx-a11y/no-distracting-elements": "warn",
    "jsx-a11y/no-redundant-roles": "warn",
    "jsx-a11y/role-has-required-aria-props": "warn",
    "jsx-a11y/role-supports-aria-props": "warn",
    "jsx-a11y/scope": "warn",
  },
};

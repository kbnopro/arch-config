import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import teslint from "typescript-eslint";

export default teslint.config([
  eslint.configs.recommended,
  teslint.configs.strictTypeChecked,
  importPlugin.flatConfigs.recommended,
  stylistic.configs.customize({
    flat: true,
    semi: true,
    quotes: "double",
  }),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },
  {
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          moduleDirectory: ["node_modules"],
        },
        typescript: {
          alwaysTryTypes: true,
          project: "~/.config/ags",
        },
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: "~/.config/ags",
      },
    },
  },
  {
    ignores: ["./@girs/"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      // works but I haven't figured out the way to resolve types in @girs
      "import/no-unresolved": "off",
      // works, but I need to ban just the ../ pattern and not the @
      // some workarounds is possible at the cost barrel files,
      // which I generally prefer
      "import/no-relative-parent-imports": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../"],
              message: "Relative import from parent dirs is forbidden.",
            },
          ],
        },
      ],
      // haven't tested this yet
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/features/notification",
              from: "./src/features",
              except: ["./notification"],
            },
          ],
        },
      ],
    },
  },
]);

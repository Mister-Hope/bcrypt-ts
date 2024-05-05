// @ts-check
import hopeConfig, { config, tsParser } from "eslint-config-mister-hope";

export default config(
  ...hopeConfig,

  {
    ignores: ["**/dist/**", "**/node_modules/**", "coverage/**"],
  },

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        parser: tsParser,
        tsconfigDirName: import.meta.dirname,
        project: ["./tsconfig.json"],
      },
    },
  },
);

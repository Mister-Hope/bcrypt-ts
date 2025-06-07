import { hope } from "eslint-config-mister-hope";

export default hope({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["eslint.config.js"],
      },
    },
  },
  tsImport: {
    rules: {
      "import-x/no-unresolved": ["error", { ignore: ["^@"] }],
    },
  },
});

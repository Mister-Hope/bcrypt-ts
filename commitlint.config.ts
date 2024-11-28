import { defineConfig } from "cz-git";

export default defineConfig({
  extends: ["@commitlint/config-conventional"],
  prompt: {
    allowCustomIssuePrefix: false,
    allowEmptyIssuePrefix: false,
  },
});

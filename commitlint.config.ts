import type { UserConfig } from "cz-git";

export default {
  extends: ["@commitlint/config-conventional"],

  prompt: {
    allowCustomIssuePrefix: false,
    allowEmptyIssuePrefix: false,
  },
} as UserConfig;

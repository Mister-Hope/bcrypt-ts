/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  prompt: {
    allowCustomIssuePrefix: false,
    allowEmptyIssuePrefix: false,
  },
};

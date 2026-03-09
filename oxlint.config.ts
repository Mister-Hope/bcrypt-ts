import { defineConfig } from "oxlint";
import { defaultIgnorePatterns, getOxlintConfigs } from "oxc-config-hope";

export default defineConfig({
  extends: getOxlintConfigs({
    vitest: {
      bench: true,
    },
  }),
  ignorePatterns: defaultIgnorePatterns,
  rules: {
    "id-length": "off",
    "no-bitwise": "off",
    "no-plusplus": "off",
  },
});

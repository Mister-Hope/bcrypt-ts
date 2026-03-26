import { defaultIgnorePatterns, getOxlintConfigs } from "oxc-config-hope/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: getOxlintConfigs({
    vitest: {
      bench: true,
    },
  }),
  options: {
    typeAware: true,
    typeCheck: true,
  },
  ignorePatterns: defaultIgnorePatterns,
  rules: {
    "id-length": "off",
    "no-bitwise": "off",
    "no-plusplus": "off",
  },
});

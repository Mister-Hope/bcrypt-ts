import { defineHopeConfig } from "oxc-config-hope/oxlint";

export default defineHopeConfig({
  rules: {
    "id-length": "off",
    "no-bitwise": "off",
    "no-plusplus": "off",
  },
  vitest: {
    bench: true,
  },
});

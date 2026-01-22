import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      nextTick: path.resolve(__dirname, "src/nextTick/node.ts"),
      random: path.resolve(__dirname, "src/random/node.ts"),
    },
  },
  test: {
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.ts"],
      exclude: ["src/**/browser.ts"],
    },

    ...(process.env.CODECOV_TOKEN
      ? {
          reporters: ["junit"],
          outputFile: {
            junit: "coverage/test-report.junit.xml",
          },
        }
      : {}),
  },
});

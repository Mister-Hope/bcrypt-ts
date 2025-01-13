import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      random: path.resolve(__dirname, "src/random/node.ts"),
    },
  },
  test: {
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.ts"],
    },
    include: ["**/*.spec.ts"],

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

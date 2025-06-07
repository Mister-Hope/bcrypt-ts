import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "@nextTick": path.resolve(__dirname, "src/nextTick/node.ts"),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "@random": path.resolve(__dirname, "src/random/node.ts"),
    },
  },
  test: {
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.ts"],
      exclude: ["src/**/browser.ts"],
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

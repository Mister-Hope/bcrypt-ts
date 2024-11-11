import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      random: path.resolve(__dirname, "src/random/node.ts"),
    },
  },
});

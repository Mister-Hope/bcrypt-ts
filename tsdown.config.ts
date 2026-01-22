import { codecovRollupPlugin } from "@codecov/rollup-plugin";
import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: {
      node: "./src/index.ts",
    },
    outDir: "./dist",
    alias: {
      nextTick: "./nextTick/node.js",
      random: "./random/node.js",
    },
    target: "node20",
    dts: true,
    plugins: [
      codecovRollupPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: "node",
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    platform: "node",
    fixedExtension: false,
    minify: true,
    sourcemap: true,
  },
  {
    entry: {
      browser: "./src/index.ts",
    },
    outDir: "./dist",
    alias: {
      nextTick: "./nextTick/browser.js",
      random: "./random/browser.js",
    },
    target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
    dts: true,
    plugins: [
      codecovRollupPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: "browser",
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    platform: "browser",
    minify: true,
    sourcemap: true,
  },
]);

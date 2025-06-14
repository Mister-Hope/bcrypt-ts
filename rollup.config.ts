import { codecovRollupPlugin } from "@codecov/rollup-plugin";
import alias from "@rollup/plugin-alias";
import { defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

export default defineConfig([
  {
    input: "./src/index.ts",
    output: [
      {
        file: "./dist/browser.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "./dist/browser.mjs",
        format: "esm",
        sourcemap: true,
      },
      {
        file: "./dist/browser.umd.js",
        format: "umd",
        name: "bcrypt",
        sourcemap: true,
      },
    ],
    plugins: [
      (alias as unknown as typeof alias.default)({
        entries: {
          nextTick: "./nextTick/browser",
          random: "./random/browser",
        },
      }),

      esbuild({
        charset: "utf8",
        minify: true,
        target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
      }),
      codecovRollupPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: "browser",
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    external: ["node:crypto"],
  },
  {
    input: "./src/index.ts",
    output: [
      {
        file: "./dist/node.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "./dist/node.mjs",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      (alias as unknown as typeof alias.default)({
        entries: { nextTick: "./nextTick/node", random: "./random/node" },
      }),
      esbuild({ charset: "utf8", minify: true, target: "node20" }),
      codecovRollupPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: "node",
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    external: ["node:crypto"],
  },

  {
    input: "./src/index.ts",
    output: [
      { file: "./dist/browser.d.cts", format: "esm" },
      { file: "./dist/browser.d.mts", format: "esm" },
      { file: "./dist/node.d.cts", format: "esm" },
      { file: "./dist/node.d.mts", format: "esm" },
    ],
    plugins: [dts()],
    external: ["node:crypto"],
  },
]);

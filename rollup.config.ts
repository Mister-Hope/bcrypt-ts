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
        file: "./dist/browser.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      alias({
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
        file: "./dist/node.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      alias({
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
      { file: "./dist/browser.d.ts", format: "esm" },
      { file: "./dist/node.d.ts", format: "esm" },
    ],
    plugins: [dts()],
    external: ["node:crypto"],
  },
]);

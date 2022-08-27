import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

export default [
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
    ],
    plugins: [
      alias({ entries: { "@random": "./random/browser" } }),
      typescript(),
      terser(),
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
      alias({ entries: { "@random": "./random/node" } }),
      typescript(),
      terser(),
    ],
  },

  {
    input: "./src/index.ts",
    output: [
      { file: "./dist/browser.d.ts", format: "esm" },
      { file: "./dist/browser.d.cts", format: "esm" },
      { file: "./dist/browser.d.mts", format: "esm" },
      { file: "./dist/node.d.ts", format: "esm" },
      { file: "./dist/node.d.cts", format: "esm" },
      { file: "./dist/node.d.mts", format: "esm" },
    ],
    plugins: [dts()],
  },
];

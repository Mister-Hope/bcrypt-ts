import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: "./dist/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "./dist/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [typescript(), terser()],
  },
  {
    input: "./src/index.ts",
    output: [
      { file: "./dist/index.d.ts", format: "esm", sourcemap: true },
      { file: "./dist/index.esm.d.ts", format: "esm", sourcemap: true },
    ],
    plugins: [dts()],
  },
];

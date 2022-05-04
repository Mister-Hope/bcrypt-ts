const { resolve } = require("path");

module.exports = {
  rootDir: resolve(__dirname),
  collectCoverage: true,
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
  preset: "ts-jest/presets/js-with-babel",
};

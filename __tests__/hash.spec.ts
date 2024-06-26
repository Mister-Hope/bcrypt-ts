import { expect, it } from "vitest";

import { hash, hashSync } from "../src/index.js";

it("Hash sync", () => {
  expect(hashSync("hello", 10)).not.toEqual(hashSync("hello", 10));
});

it("Hash async", () => {
  void hash("hello", 10).then((hash) => {
    expect(typeof hash).toBe("string");
  });
});

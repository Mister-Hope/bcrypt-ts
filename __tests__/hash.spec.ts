import { expect, it } from "vitest";

import { hash, hashSync } from "../src/index.js";

it("Hash sync", () => {
  expect(hashSync("hello", 10)).not.toEqual(hashSync("hello", 10));
  expect(hashSync("中国我爱你！", 10)).not.toEqual(
    hashSync("中国我爱你！", 10),
  );
});

it("Hash async", () => {
  void hash("hello", 10).then((hash) => {
    expect(hash).toBeTypeOf("string");
  });
  void hash("中国我爱你！", 10).then((hash) => {
    expect(hash).toBeTypeOf("string");
  });
});

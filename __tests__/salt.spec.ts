import { expect, it } from "vitest";
import { genSalt, genSaltSync } from "../src/index.js";

it("Gen salt sync", () => {
  const salt = genSaltSync(10);

  expect(typeof salt).toBe("string");
  expect(salt.length).toBe(29);
});

it("Gen salt async", async () => {
  const salt = await genSalt(10);

  expect(typeof salt).toBe("string");
  expect(salt.length).toBe(29);
});

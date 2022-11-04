import { expect, it } from "vitest";
import { getSalt, genSaltSync, hashSync, getRounds } from "../src/index.js";

it("Get salt", () => {
  const hash1 = hashSync("hello", genSaltSync());
  const salt = getSalt(hash1);
  const hash2 = hashSync("hello", salt);

  expect(hash1).toEqual(hash2);
});

it("Get rounds", () => {
  const hash1 = hashSync("hello", genSaltSync());

  expect(getRounds(hash1)).toBe(10);
});

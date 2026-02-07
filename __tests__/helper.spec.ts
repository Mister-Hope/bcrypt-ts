import { describe, expect, it } from "vitest";

import { genSaltSync, getRounds, getSalt, hashSync, truncates } from "../src/index.js";

describe(getSalt, () => {
  it("should work", () => {
    const hash1 = hashSync("hello", genSaltSync());
    const salt = getSalt(hash1);
    const hash2 = hashSync("hello", salt);

    expect(hash1).toEqual(hash2);
  });

  it("should throw error for invalid argument types", () => {
    // @ts-expect-error: error type check
    expect(() => getSalt(123)).toThrow("Illegal arguments: number");
    // @ts-expect-error: error type check
    expect(() => getSalt(null)).toThrow("Illegal arguments: object");
  });

  it("should throw error for invalid hash length", () => {
    expect(() => getSalt("invalid")).toThrow("Illegal hash length: 7 != 60");
    expect(() => getSalt("short")).toThrow("Illegal hash length: 5 != 60");
  });
});

describe(getRounds, () => {
  it("should work", () => {
    const hash1 = hashSync("hello", genSaltSync());

    expect(getRounds(hash1)).toBe(10);
  });

  it("should throw error for invalid argument types", () => {
    // @ts-expect-error: error type check
    expect(() => getRounds(123)).toThrow("Illegal arguments: number");
    // @ts-expect-error: error type check
    expect(() => getRounds(null)).toThrow("Illegal arguments: object");
  });
});

describe(truncates, () => {
  it("should work", () => {
    expect(truncates("hello")).toBe(false);
    expect(truncates("a".repeat(72))).toBe(false);
    expect(truncates("a".repeat(73))).toBe(true);
  });

  it("should throw error for invalid argument types", () => {
    // @ts-expect-error: error type check
    expect(() => truncates(123)).toThrow("Illegal arguments: number");
    // @ts-expect-error: error type check
    expect(() => truncates(null)).toThrow("Illegal arguments: object");
  });
});

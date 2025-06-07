import { describe, expect, it } from "vitest";

import {
  compare,
  compareSync,
  genSalt,
  genSaltSync,
  hash,
  hashSync,
} from "../src/index.js";

describe("compare", () => {
  it("should return true for valid password-hash pairs", async () => {
    const salt1 = await genSalt();
    const hash1 = await hash("hello", salt1);
    const salt2 = (await genSalt()).replace(/\$2b\$/, "$2y$");
    const hash2 = await hash("world", salt2);

    expect(await compare("hello", hash1)).toBe(true);
    expect(await compare("hello", hash2)).toBe(false);
    expect(await compare("world", hash1)).toBe(false);
    expect(await compare("world", hash2)).toBe(true);
  });

  it("should reject with error for invalid argument types", async () => {
    // @ts-expect-error: error type check
    await expect(compare(123, "hash")).rejects.toThrow(
      "Illegal arguments: number, string",
    );
    // @ts-expect-error: error type check
    await expect(compare("content", 123)).rejects.toThrow(
      "Illegal arguments: string, number",
    );
    // @ts-expect-error: error type check
    await expect(compare(123, 456)).rejects.toThrow(
      "Illegal arguments: number, number",
    );
  });

  it("should resolve false for invalid hash length", async () => {
    await expect(compare("hello", "invalid")).resolves.toBe(false);
    await expect(compare("hello", "short")).resolves.toBe(false);
    await expect(compare("hello", "a".repeat(59))).resolves.toBe(false);
  });
});

describe("compareSync", () => {
  it("should return true for valid password-hash pairs", () => {
    const salt1 = genSaltSync();
    const hash1 = hashSync("hello", salt1);
    const salt2 = genSaltSync().replace(/\$2b\$/, "$2y$");
    const hash2 = hashSync("world", salt2);

    expect(hash1.substring(0, 4)).toBe("$2b$");
    expect(compareSync("hello", hash1)).toBe(true);
    expect(compareSync("hello", hash2)).toBe(false);

    expect(hash2.substring(0, 4)).toBe("$2y$");
    expect(compareSync("world", hash1)).toBe(false);
    expect(compareSync("world", hash2)).toBe(true);
  });

  it("should throw error for invalid argument types", () => {
    // @ts-expect-error: error type check
    expect(() => compareSync(123, "hash")).toThrow(
      "Illegal arguments: number, string",
    );
    // @ts-expect-error: error type check
    expect(() => compareSync("content", 123)).toThrow(
      "Illegal arguments: string, number",
    );
    // @ts-expect-error: error type check
    expect(() => compareSync(123, 456)).toThrow(
      "Illegal arguments: number, number",
    );
  });

  it("should return false for invalid hash length", () => {
    expect(compareSync("hello", "invalid")).toBe(false);
    expect(compareSync("hello", "short")).toBe(false);
    expect(compareSync("hello", "a".repeat(59))).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

import { hash, hashSync } from "../src/index.js";

describe(hash, () => {
  it("should generate hash for valid inputs", async () => {
    const hash1 = await hash("hello", 10);
    const hash2 = await hash("hello", 10);
    const hash3 = await hash("中国我爱你！", 10);
    const hash4 = await hash("中国我爱你！", 10);

    expect(hash1).toBeTypeOf("string");
    expect(hash2).toBeTypeOf("string");
    expect(hash3).toBeTypeOf("string");
    expect(hash4).toBeTypeOf("string");
    expect(hash1).not.toEqual(hash2);
    expect(hash3).not.toEqual(hash4);

    const hash5 = await hash("hello", 4);
    expect(hash5).toContain("$04$");

    const hash6 = await hash("hello", "$2$10$abcdefghijklmnopqrstuv");
    expect(hash6).toContain("$2$10$");
  });

  it("should reject for invalid argument types", async () => {
    // @ts-expect-error: error type check
    await expect(hash(123, 10)).rejects.toThrow("Invalid content / salt: not a string");
    // @ts-expect-error: error type check
    await expect(hash(123, "invalid")).rejects.toThrow("Invalid content / salt: not a string");
  });

  it("should reject for invalid salt version", async () => {
    await expect(hash("hello", "invalid")).rejects.toThrow("Invalid salt version: in");
    await expect(hash("hello", "$1$")).rejects.toThrow("Invalid salt version: $1");
  });

  it("should reject for invalid salt revision", async () => {
    await expect(hash("hello", "$2x$10$")).rejects.toThrow("Invalid salt revision: x$");
    await expect(hash("hello", "$2xx")).rejects.toThrow("Invalid salt revision: xx");
    await expect(hash("hello", "$2xxaaa")).rejects.toThrow("Invalid salt revision: xx");
  });

  it("should reject for missing salt rounds", async () => {
    await expect(hash("hello", "$2a$")).rejects.toThrow("Missing salt rounds");
    await expect(hash("hello", "$2a$1Z$validsalthere")).rejects.toThrow("Missing salt rounds");

    await expect(hash("hello", "$2a$ab$validSaltHere123")).rejects.toThrow("Missing salt rounds");
  });

  it("should reject for invalid rounds", async () => {
    await expect(hash("hello", `$2a$03$${"a".repeat(22)}`)).rejects.toThrow(
      "Illegal number of rounds (4-31): 3",
    );
    await expect(hash("hello", `$2a$32$${"a".repeat(22)}`)).rejects.toThrow(
      "Illegal number of rounds (4-31): 32",
    );
  });

  it("should reject for invalid salt length", async () => {
    await expect(hash("hello", "$2$10$validsalthere")).rejects.toThrow(
      "Illegal salt: validsalthere",
    );
  });
});

describe(hashSync, () => {
  it("should generate hash for valid inputs", () => {
    const hash1 = hashSync("hello", 10);
    const hash2 = hashSync("hello", 10);
    const hash3 = hashSync("中国我爱你！", 10);
    const hash4 = hashSync("中国我爱你！", 10);
    const hash7 = hashSync("hello");

    expect(hash1).toBeTypeOf("string");
    expect(hash2).toBeTypeOf("string");
    expect(hash3).toBeTypeOf("string");
    expect(hash4).toBeTypeOf("string");
    expect(hash7).toBeTypeOf("string");
    expect(hash1).not.toEqual(hash2);
    expect(hash3).not.toEqual(hash4);

    const hash5 = hashSync("hello", 4);
    expect(hash5).toContain("$04$");

    const hash6 = hashSync("hello", "$2$10$abcdefghijklmnopqrstuv");
    expect(hash6).toContain("$2$10$");
  });

  it("should throw error for invalid argument types", () => {
    // @ts-expect-error: error type check
    expect(() => hashSync(123, 10)).toThrow("Invalid content / salt: not a string");
    // @ts-expect-error: error type check
    expect(() => hashSync(123, "invalid")).toThrow("Invalid content / salt: not a string");
  });

  it("should reject for invalid salt version", () => {
    expect(() => hashSync("hello", "invalid")).toThrow("Invalid salt version: in");
    expect(() => hashSync("hello", "$1$")).toThrow("Invalid salt version: $1");
  });

  it("should reject for invalid salt revision", () => {
    expect(() => hashSync("hello", "$2x$10$")).toThrow("Invalid salt revision: x$");
    expect(() => hashSync("hello", "$2xx")).toThrow("Invalid salt revision: xx");
    expect(() => hashSync("hello", "$2xxaaa")).toThrow("Invalid salt revision: xx");
  });

  it("should reject for missing salt rounds", () => {
    expect(() => hashSync("hello", "$2a$")).toThrow("Missing salt rounds");
    expect(() => hashSync("hello", "$2a$1Z$validsalthere")).toThrow("Missing salt rounds");

    expect(() => hashSync("hello", "$2a$ab$validSaltHere123")).toThrow("Missing salt rounds");
  });

  it("should reject for invalid rounds", () => {
    expect(() => hashSync("hello", `$2a$03$${"a".repeat(22)}`)).toThrow(
      "Illegal number of rounds (4-31): 3",
    );
    expect(() => hashSync("hello", `$2a$32$${"a".repeat(22)}`)).toThrow(
      "Illegal number of rounds (4-31): 32",
    );
  });

  it("should reject for invalid salt length", () => {
    expect(() => hashSync("hello", "$2$10$validsalthere")).toThrow("Illegal salt: validsalthere");
  });
});

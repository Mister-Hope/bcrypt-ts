import { describe, expect, it } from "vitest";

import { hash, hashSync } from "../src/index.js";

describe("hash", () => {
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
  });

  it("should reject for invalid argument types", async () => {
    // @ts-expect-error: error type check
    await expect(hash(123, 10)).rejects.toThrow(
      "Invalid content / salt: not a string",
    );
    await expect(hash("hello", "invalid")).rejects.toThrow(
      "Invalid salt version: in",
    );
  });

  it("should reject for invalid salt format", async () => {
    await expect(hash("hello", "invalid")).rejects.toThrow(
      "Invalid salt version: in",
    );
    await expect(hash("hello", "$1$")).rejects.toThrow(
      "Invalid salt version: $1",
    );
    await expect(hash("hello", "$2x$10$")).rejects.toThrow(
      "Invalid salt revision: x$",
    );
    await expect(hash("hello", "$2a$")).rejects.toThrow(
      "Illegal salt length: 0 != 16",
    );
    await expect(hash("hello", "$2$10$validsalthere")).rejects.toThrow(
      "Illegal salt length: 9 != 16",
    );
    await expect(hash("hello", "$2a$1Z$validsalthere")).rejects.toThrow(
      "Illegal salt length: 9 != 16",
    );
  });
});

describe("hashSync", () => {
  it("should generate hash for valid inputs", () => {
    const hash1 = hashSync("hello", 10);
    const hash2 = hashSync("hello", 10);
    const hash3 = hashSync("中国我爱你！", 10);
    const hash4 = hashSync("中国我爱你！", 10);

    expect(hash1).toBeTypeOf("string");
    expect(hash2).toBeTypeOf("string");
    expect(hash3).toBeTypeOf("string");
    expect(hash4).toBeTypeOf("string");
    expect(hash1).not.toEqual(hash2);
    expect(hash3).not.toEqual(hash4);
  });

  it("should throw error for invalid argument types", () => {
    // @ts-expect-error: error type check
    expect(() => hashSync(123, 10)).toThrow(
      "Invalid content / salt: not a string",
    );
    expect(() => hashSync("hello", "invalid")).toThrow(
      "Invalid salt version: in",
    );
  });

  it("should throw error for invalid salt format", () => {
    expect(() => hashSync("hello", "invalid")).toThrow(
      "Invalid salt version: in",
    );
    expect(() => hashSync("hello", "$1$")).toThrow("Invalid salt version: $1");
    expect(() => hashSync("hello", "$2x$10$valid_salt_here")).toThrow(
      "Invalid salt revision: x$",
    );
    expect(() => hashSync("hello", "$2a$0")).toThrow(
      "Illegal salt length: 0 != 16",
    );
    expect(() => hashSync("hello", "$2$10$validsalthere")).toThrow(
      "Illegal salt length: 9 != 16",
    );
    expect(() => hashSync("hello", "$2a$1Z$validsalthere")).toThrow(
      "Illegal salt length: 9 != 16",
    );
  });
});

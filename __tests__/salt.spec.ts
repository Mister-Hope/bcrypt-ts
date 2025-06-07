import { describe, expect, it } from "vitest";

import { genSalt, genSaltSync } from "../src/index.js";

describe("genSalt", () => {
  it("should generate valid salt", async () => {
    const salt = await genSalt(10);

    expect(salt).toBeTypeOf("string");
    expect(salt.length).toBe(29);
  });

  it("should throw error for invalid argument types", async () => {
    // @ts-expect-error: error type check
    await expect(() => genSalt("invalid")).rejects.toThrow(
      "Illegal arguments: string",
    );
    // @ts-expect-error: error type check
    await expect(() => genSalt(null)).rejects.toThrow(
      "Illegal arguments: object",
    );
  });

  it("should handle boundary rounds", async () => {
    await expect(genSalt(3)).resolves.toMatch(/^\$2b\$04\$/);
    await expect(genSalt(4)).resolves.toMatch(/^\$2b\$04\$/);
    await expect(genSalt(31)).resolves.toMatch(/^\$2b\$31\$/);
    await expect(genSalt(32)).resolves.toMatch(/^\$2b\$31\$/);
  });
});

describe("genSaltSync", () => {
  it("should generate valid salt", () => {
    const salt = genSaltSync(10);

    expect(salt).toBeTypeOf("string");
    expect(salt.length).toBe(29);
  });

  it("should throw error for invalid argument types", () => {
    // @ts-expect-error: error type check
    expect(() => genSaltSync("invalid")).toThrow("Illegal arguments: string");
    // @ts-expect-error: error type check
    expect(() => genSaltSync(null)).toThrow("Illegal arguments: object");
  });

  it("should handle boundary rounds", () => {
    expect(genSaltSync(3)).toMatch(/^\$2b\$04\$/); // Should be clamped to 4
    expect(genSaltSync(4)).toMatch(/^\$2b\$04\$/);
    expect(genSaltSync(31)).toMatch(/^\$2b\$31\$/);
    expect(genSaltSync(32)).toMatch(/^\$2b\$31\$/); // Should be clamped to 31
  });
});

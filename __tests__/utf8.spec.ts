import { describe, expect, it } from "vitest";

import { convertToUFT8Bytes, getUTF8ByteLength } from "../src/uft8.js";

describe(getUTF8ByteLength, () => {
  it("should handle ASCII characters", () => {
    expect(getUTF8ByteLength("hello")).toBe(5);
    expect(getUTF8ByteLength("")).toBe(0);
  });

  it("should handle 2-byte UTF8 characters", () => {
    expect(getUTF8ByteLength("café")).toBe(5); // é is 2 bytes
    expect(getUTF8ByteLength("ñ")).toBe(2);
  });

  it("should handle 3-byte UTF8 characters", () => {
    expect(getUTF8ByteLength("中")).toBe(3);
    expect(getUTF8ByteLength("中国")).toBe(6);
  });

  it("should handle 4-byte UTF8 characters (surrogate pairs)", () => {
    expect(getUTF8ByteLength("𝓗")).toBe(4); // Mathematical script H
    expect(getUTF8ByteLength("🌟")).toBe(4); // Star emoji
  });
});

describe(convertToUFT8Bytes, () => {
  it("should handle ASCII characters", () => {
    const result = convertToUFT8Bytes("hello");

    expect(result).toStrictEqual([104, 101, 108, 108, 111]);
  });

  it("should handle 2-byte UTF8 characters", () => {
    const result = convertToUFT8Bytes("ñ");

    expect(result).toStrictEqual([195, 177]);
  });

  it("should handle 3-byte UTF8 characters", () => {
    const result = convertToUFT8Bytes("中");

    expect(result).toStrictEqual([228, 184, 173]);
  });

  it("should handle 4-byte UTF8 characters (surrogate pairs)", () => {
    const result = convertToUFT8Bytes("🌟");

    expect(result).toHaveLength(4);
    expect(result[0]).toBe(240); // First byte should start with 11110xxx
  });

  it("should handle mixed character types", () => {
    const result = convertToUFT8Bytes("a中🌟");

    expect(result).toHaveLength(8); // 1 + 3 + 4 bytes
  });
});

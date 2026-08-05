import { describe, expect, it } from "vitest";

import { decodeBase64, encodeBase64 } from "../src/base64.js";

describe(encodeBase64, () => {
  it("should encode byte array to base64 string", () => {
    expect(
      encodeBase64(
        [
          0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
          0x0f, 0x10,
        ],
        16,
      ),
    ).toBe("..CA.uOD/eaGAOmJB.yMBu");
  });

  it("should throw error for invalid length", () => {
    expect(() => encodeBase64([1, 2, 3], 0)).toThrow("Illegal length: 0");
    expect(() => encodeBase64([1, 2, 3], -1)).toThrow("Illegal length: -1");
    expect(() => encodeBase64([1, 2, 3], 5)).toThrow("Illegal length: 5");
  });
});

describe(decodeBase64, () => {
  it("should decode base64 string to byte array", () => {
    expect(decodeBase64("..CA.uOD/eaGAOmJB.yMBv.", 16)).toStrictEqual([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
      0x0f,
    ]);
  });

  it("should throw error for invalid length", () => {
    expect(() => decodeBase64("test", 0)).toThrow("Illegal length: 0");
    expect(() => decodeBase64("test", -1)).toThrow("Illegal length: -1");
  });

  it("should handle invalid characters gracefully", () => {
    const result = decodeBase64("invalid@char", 5);

    expect(result.length).toBeLessThanOrEqual(5);
  });

  it("should handle characters with code >= BASE64_INDEX.length", () => {
    // \u0080 has code 128, which is >= BASE64_INDEX.length (128)
    const result1 = decodeBase64("\u0080\u0080\u0080\u0080", 5);
    expect(result1).toHaveLength(0);

    const result2 = decodeBase64("..\u0080\u0080", 5);
    expect(result2).toHaveLength(1);

    // \u0080 at the 4th char of the group is also invalid: decoding must stop,
    // leaving only the first 2 bytes (currently a corrupted 0xffff byte is emitted)
    const result3 = decodeBase64("...\u0080", 5);
    expect(result3).toStrictEqual([0, 0]);
  });

  it("should handle early break on invalid c1 or c2", () => {
    // Test with string containing invalid characters at start
    const result = decodeBase64("@invalid", 5);

    expect(result).toHaveLength(0);
  });

  it("should handle early break on invalid c3", () => {
    // Test with valid start but invalid c3
    const result = decodeBase64("..@", 5);

    expect(result).toHaveLength(1);
  });

  it("should handle early break on invalid c4", () => {
    // Test with valid start but invalid c4 to trigger c4 === -1 case.
    // Decoding must stop like c3 does, not emit a corrupted byte (0xffff).
    const result = decodeBase64("...@", 5);

    expect(result).toStrictEqual([0, 0]);
  });

  it("should stop decoding at invalid c4 mid-stream", () => {
    // An invalid c4 in the middle of the string must stop decoding entirely.
    const result = decodeBase64("...@...", 5);

    expect(result).toStrictEqual([0, 0]);
  });

  it("should never emit bytes outside the 0-255 range", () => {
    // Any invalid c4 currently produces byte 65535; decoded bytes must stay 0-255.
    const result = decodeBase64("...@", 5);

    expect(Math.max(...result)).toBeLessThanOrEqual(255);
    expect(Math.min(...result)).toBeGreaterThanOrEqual(0);
  });

  it("should handle length limit reached", () => {
    // Test case where length limit is reached
    const result = decodeBase64("..CA.uOD/eaGAOmJB.yMBv.", 3);

    expect(result).toHaveLength(3);
  });

  it("should handle string length limit reached", () => {
    // Test case where off >= stringLength
    const result = decodeBase64("..", 5);

    expect(result).toHaveLength(1);
  });
});

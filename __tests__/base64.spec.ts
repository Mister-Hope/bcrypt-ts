import { describe, expect, it } from "vitest";

import { decodeBase64, encodeBase64 } from "../src/base64.js";

describe("encodeBase64", () => {
  it("should encode byte array to base64 string", () => {
    expect(
      encodeBase64(
        [
          0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a,
          0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
        ],
        16,
      ),
    ).toEqual("..CA.uOD/eaGAOmJB.yMBu");
  });

  it("should throw error for invalid length", () => {
    expect(() => encodeBase64([1, 2, 3], 0)).toThrow("Illegal length: 0");
    expect(() => encodeBase64([1, 2, 3], -1)).toThrow("Illegal length: -1");
    expect(() => encodeBase64([1, 2, 3], 5)).toThrow("Illegal length: 5");
  });
});

describe("decodeBase64", () => {
  it("should decode base64 string to byte array", () => {
    expect(decodeBase64("..CA.uOD/eaGAOmJB.yMBv.", 16)).toEqual([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]);
  });

  it("should handle invalid characters gracefully", () => {
    const result = decodeBase64("invalid@char", 5);

    expect(result.length).toBeLessThanOrEqual(5);
  });
});

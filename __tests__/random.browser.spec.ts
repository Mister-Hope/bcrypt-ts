import { afterEach, describe, expect, it, vi } from "vitest";

import { random } from "../src/random/browser.js";

describe(random, () => {
  // oxlint-disable-next-line vitest/no-hooks
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return the requested number of bytes", () => {
    const result = random(16);

    expect(result).toHaveLength(16);

    for (const byte of result) {
      expect(Number.isInteger(byte)).toBe(true);
      expect(byte).toBeGreaterThanOrEqual(0);
      expect(byte).toBeLessThanOrEqual(255);
    }
  });

  it("should throw when WebCryptoAPI is not available", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: () => {
        throw new Error("unavailable");
      },
    });

    expect(() => random(16)).toThrow("WebCryptoAPI / globalThis is not available");
  });
});

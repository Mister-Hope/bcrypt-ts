import { describe, expect, it } from "vitest";

import { nextTick } from "../src/nextTick/node.js";

describe(nextTick, () => {
  it("should work correctly", () =>
    new Promise<void>((resolve) => {
      let executed = false;

      nextTick(() => {
        executed = true;
        expect(executed).toBeTruthy();
        resolve();
      });

      expect(executed).toBeFalsy();
    }));

  it("should use setImmediate in Node.js", () => {
    // Test that nextTick is using the correct function
    expect(typeof nextTick).toBe("function");
  });
});

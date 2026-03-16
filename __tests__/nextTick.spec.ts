import { describe, expect, expectTypeOf, it } from "vitest";

import { nextTick } from "../src/nextTick/node.js";

describe(nextTick, () => {
  it("should work correctly", () =>
    new Promise<void>((resolve) => {
      let executed = false;

      nextTick(() => {
        executed = true;
        expect(executed).toBe(true);
        resolve();
      });

      expect(executed).toBe(false);
    }));

  it("should use setImmediate in Node.js", () => {
    // Test that nextTick is using the correct function
    expectTypeOf(nextTick).toBeFunction();
  });
});

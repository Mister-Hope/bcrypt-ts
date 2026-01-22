import { describe, expect, it } from "vitest";

import { genSaltSync, hash } from "../src/index.js";

describe("hash progress callback", () => {
  it("should show progress", async () => {
    const salt = genSaltSync(12);

    const progress: number[] = [];

    const result = await hash("hello world", salt, (percent) => {
      progress.push(percent);
    });

    expect(typeof result === "string").toBeTruthy();
    expect(progress.length).toBeGreaterThan(2);
    expect(progress[0]).toBe(0);
    expect(progress[progress.length - 1]).toBe(1);
  });
});

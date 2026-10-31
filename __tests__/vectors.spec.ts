import { describe, expect, it } from "vitest";

import { compareSync, hashSync } from "../src/index.js";

/**
 * Known-answer vectors from the reference bcrypt test suite. They are independent of this library's
 * own salt generation, so they catch regressions in the Blowfish key schedule, salt parsing or the
 * bcrypt base64 alphabet.
 */
const vectors: readonly (readonly [content: string, salt: string, expected: string])[] = [
  [
    "",
    "$2a$06$DCq7YPn5Rq63x1Lad4cll.",
    "$2a$06$DCq7YPn5Rq63x1Lad4cll.TV4S6ytwfsfvkgY8jIucDrjc8deX1s.",
  ],
  [
    "a",
    "$2a$06$m0CrhHm10qJ3lXRY.5zDGO",
    "$2a$06$m0CrhHm10qJ3lXRY.5zDGO3rS2KdeeWLuGmsfGlMfOxih58VYVfxe",
  ],
  [
    "abc",
    "$2a$06$If6bvum7DFjUnE9p2uDeDu",
    "$2a$06$If6bvum7DFjUnE9p2uDeDu0YHzrHM6tf.iqN8.yx.jNN1ILEf7h0i",
  ],
  [
    "abcdefghijklmnopqrstuvwxyz",
    "$2a$06$.rCVZVOThsIa97pEDOxvGu",
    "$2a$06$.rCVZVOThsIa97pEDOxvGuRRgzG64bvtJ0938xuqzv18d3ZpQhstC",
  ],
  [
    "~!@#$%^&*()      ~!@#$%^&*()PNBFRD",
    "$2a$06$fPIsBO8qRqkjj273rfaOI.",
    "$2a$06$fPIsBO8qRqkjj273rfaOI.HtSV9jLDpTbZn782DC6/t7qT67P6FfO",
  ],
];

describe("bcrypt known-answer vectors", () => {
  it.each(vectors)("hashes the reference vector for %j", (content, salt, expected) => {
    expect(hashSync(content, salt)).toBe(expected);
    expect(compareSync(content, expected)).toBe(true);
    expect(compareSync(`${content}!`, expected)).toBe(false);
  });

  it("ignores password bytes beyond 72 bytes", () => {
    const salt = "$2a$06$DCq7YPn5Rq63x1Lad4cll.";

    expect(hashSync("a".repeat(73), salt)).toBe(hashSync("a".repeat(72), salt));
    expect(hashSync("a".repeat(72), salt)).not.toBe(hashSync("a".repeat(71), salt));
  });
});

import { expect, it } from "vitest";

import {
  compare,
  compareSync,
  genSalt,
  genSaltSync,
  hash,
  hashSync,
} from "../src/index.js";

it("Compare sync", () => {
  const salt1 = genSaltSync();
  const hash1 = hashSync("hello", salt1);
  const salt2 = genSaltSync().replace(/\$2a\$/, "$2y$");
  const hash2 = hashSync("world", salt2);
  const salt3 = genSaltSync().replace(/\$2a\$/, "$2b$");
  const hash3 = hashSync("hello world", salt3);

  expect(hash1.substring(0, 4)).toBe("$2a$");
  expect(compareSync("hello", hash1)).toBe(true);
  expect(compareSync("hello", hash2)).toBe(false);
  expect(compareSync("hello", hash3)).toBe(false);

  expect(hash2.substring(0, 4)).toBe("$2y$");
  expect(compareSync("world", hash1)).toBe(false);
  expect(compareSync("world", hash2)).toBe(true);
  expect(compareSync("world", hash3)).toBe(false);

  expect(hash3.substring(0, 4)).toBe("$2b$");
  expect(compareSync("hello world", hash1)).toBe(false);
  expect(compareSync("hello world", hash2)).toBe(false);
  expect(compareSync("hello world", hash3)).toBe(true);
});

it("Compare async", async () => {
  const salt1 = await genSalt();
  const hash1 = await hash("hello", salt1);
  const salt2 = (await genSalt()).replace(/\$2a\$/, "$2y$");
  const hash2 = await hash("world", salt2);

  expect(await compare("hello", hash1)).toBe(true);
  expect(await compare("hello", hash2)).toBe(false);
  expect(await compare("world", hash1)).toBe(false);
  expect(await compare("world", hash2)).toBe(true);
});

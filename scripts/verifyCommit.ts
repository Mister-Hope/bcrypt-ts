import { readFile } from "node:fs/promises";
import path from "node:path";

import picocolors from "picocolors";

const msgPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(".git/COMMIT_EDITMSG");
const msg = (await readFile(msgPath, "utf-8")).trim();
// Only the first line (subject) is validated; the body may be any format.
const subject = msg.split("\n", 1)[0].trim();

const types = [
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "workflow",
  "build",
  "ci",
  "chore",
  "types",
  "release",
];

const commitRE = /^(?:revert: )?(?<type>[^(]*?)!?: .{1,50}$/u;

const match = commitRE.exec(subject);

if (!match) {
  console.error(
    `${picocolors.white(picocolors.bgRed(" ERROR "))} ${picocolors.red(
      `invalid commit message format.`,
    )}`,
  );
  // oxlint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

if (!types.includes(match.groups?.type ?? "")) {
  console.error(
    `${picocolors.white(picocolors.bgRed(" ERROR "))} ${picocolors.red(
      `invalid commit message type: "${match.groups?.type}".`,
    )}`,
  );
  // oxlint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

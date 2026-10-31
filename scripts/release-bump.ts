import { fileURLToPath } from "node:url";

import { Bumper } from "conventional-recommended-bump";

// `conventional-recommended-bump` loads its preset with a bare dynamic import relative to the
// preset loader. With pnpm's global/isolated virtual store the preset is not a dependency of the
// loader, so that import fails ("Unable to load the ... preset"). Resolving the preset to an
// absolute path keeps this working regardless of the store layout.
const preset = fileURLToPath(import.meta.resolve("conventional-changelog-conventionalcommits"));

const recommendation = await new Bumper(process.cwd())
  .loadPreset(preset)
  .tag({ prefix: "v" })
  .bump();

if ("releaseType" in recommendation) {
  // `reason` (e.g. "There are 1 BREAKING CHANGES and 2 features") is logged, not printed, so
  // callers can capture the recommended bump from stdout.
  console.error(recommendation.reason);
  console.log(recommendation.releaseType);
} else {
  console.error(
    "No releasable commits were found since the last tag (only docs/chore/ci/build/test/style/refactor changes). Use an explicit bump to release anyway.",
  );
  process.exitCode = 1;
}

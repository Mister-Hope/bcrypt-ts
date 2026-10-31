import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// `conventional-changelog`'s preset loader imports the preset as a bare specifier relative to
// its own location. With pnpm's global/isolated virtual store the preset is not a dependency of
// the loader, so the bare import fails ("Unable to load the ... preset"). Resolving the preset to
// an absolute path here keeps both this script and CI working regardless of the store layout.
const preset = fileURLToPath(import.meta.resolve("conventional-changelog-conventionalcommits"));

const { status } = spawnSync("conventional-changelog", ["-p", preset, ...process.argv.slice(2)], {
  stdio: "inherit",
});

process.exitCode = status ?? 1;

module.exports = {
  cooldown: (pkg) => {
    if (
      ["@mr-hope/", "@oxfmt/", "@oxlint/", "@oxlint-tsgolint/", "@vitest/"].some((prefix) =>
        pkg.startsWith(prefix),
      ) ||
      ["oxc-config-hope", "oxfmt", "oxlint", "oxlint-tsgolint", "tsdown", "vitest"].includes(pkg)
    )
      return 0;

    return 1;
  },
  upgrade: true,
  timeout: 360000,
  target: (name) => {
    if (name === "@types/node") return "minor";

    return "latest";
  },
};

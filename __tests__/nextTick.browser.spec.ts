import { describe, expect, it, vi } from "vitest";

type NextTick = (callback: () => void) => unknown;

// The browser module reads `scheduler` when it is imported, so every case has to
// stub the global first and then load a fresh copy of the module.
const loadNextTick = async (): Promise<NextTick> => {
  vi.resetModules();

  const { nextTick } = await import("../src/nextTick/browser.js");

  return nextTick;
};

describe("nextTick (browser)", () => {
  it("should fall back to setTimeout when scheduler is undefined", async () => {
    vi.stubGlobal("scheduler", undefined);

    try {
      const nextTick = await loadNextTick();
      let executed = false;

      nextTick(() => {
        executed = true;
      });

      expect(executed).toBe(false);

      await vi.waitFor(() => {
        expect(executed).toBe(true);
      });
    } finally {
      vi.unstubAllGlobals();
      vi.resetModules();
    }
  });

  it("should fall back to setTimeout when scheduler has no postTask", async () => {
    vi.stubGlobal("scheduler", {});

    try {
      const nextTick = await loadNextTick();
      let executed = false;

      nextTick(() => {
        executed = true;
      });

      expect(executed).toBe(false);

      await vi.waitFor(() => {
        expect(executed).toBe(true);
      });
    } finally {
      vi.unstubAllGlobals();
      vi.resetModules();
    }
  });

  it("should use scheduler.postTask when it is available", async () => {
    const postTask = vi.fn<(task: () => void) => Promise<void>>((task) => {
      queueMicrotask(task);

      return Promise.resolve();
    });

    vi.stubGlobal("scheduler", { postTask });

    try {
      const nextTick = await loadNextTick();
      let executed = false;

      nextTick(() => {
        executed = true;
      });

      expect(executed).toBe(false);

      await vi.waitFor(() => {
        expect(executed).toBe(true);
      });

      expect(postTask).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
      vi.resetModules();
    }
  });
});

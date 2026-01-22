/**
 * Continues with the callback on the next tick.
 */
export const nextTick: (callback: () => void) => void =
  process.env.NEXT_RUNTIME === "edge"
    ? /* istanbul ignore next -- @preserve */
      setTimeout
    : setImmediate;

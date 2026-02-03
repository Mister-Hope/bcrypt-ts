/**
 * Continues with the callback on the next tick.
 */
/* istanbul ignore next -- @preserve */
export const nextTick: (callback: () => void) => void =
  process.env.NEXT_RUNTIME === "edge" ? setTimeout : setImmediate;

/**
 * Continues with the callback on the next tick.
 */
/* istanbul ignore next -- @preserve */
export const nextTick: (callback: () => void) => void =
  // oxlint-disable-next-line node/no-process-env
  process.env.NEXT_RUNTIME === "edge" ? setTimeout : setImmediate;

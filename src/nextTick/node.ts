/**
 * @private
 *
 * Continues with the callback on the next tick.
 */
export const nextTick: (callback: () => void) => void =
  /* istanbul ignore if -- @preserve */
  process.env.NEXT_RUNTIME === "edge" ? setTimeout : setImmediate;

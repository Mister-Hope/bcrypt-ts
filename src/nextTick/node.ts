/**
 * @private
 *
 * Continues with the callback on the next tick.
 */
export const nextTick: (callback: () => void) => void =
  process.env.NEXT_RUNTIME === "edge" ? setTimeout : setImmediate;

export const getIllegalArgumentsTypeError = (...args: unknown[]): Error =>
  new Error(`Illegal arguments: ${args.map((arg) => typeof arg).join(", ")}`);

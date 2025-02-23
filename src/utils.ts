/**
 * @private
 *
 * Continues with the callback on the next tick.
 */
export const nextTick =
  typeof process === "object" && process.env.NEXT_RUNTIME === "edge"
    ? setTimeout
    : typeof setImmediate === "function"
      ? setImmediate
      : typeof process === "object" && typeof process.nextTick === "function"
        ? // eslint-disable-next-line @typescript-eslint/unbound-method
          process.nextTick
        : setTimeout;

export const getIllegalArgumentsTypeError = (...args: unknown[]): Error =>
  new Error(`Illegal arguments: ${args.map((arg) => typeof arg).join(", ")}`);

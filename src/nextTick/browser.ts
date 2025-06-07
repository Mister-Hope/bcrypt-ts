/**
 * @private
 *
 * Continues with the callback on the next tick.
 */
export const nextTick: (callback: () => void) => void = setTimeout;

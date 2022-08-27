import { encodeUTF16toUTF8 } from "./utfx";

/**
 * Continues with the callback on the next tick.
 */
export const nextTick =
  typeof process !== "undefined" &&
  process &&
  typeof process.nextTick === "function"
    ? typeof setImmediate === "function"
      ? setImmediate
      : // eslint-disable-next-line @typescript-eslint/unbound-method
        process.nextTick
    : setTimeout;

/**
 * Converts a JavaScript string to UTF8 bytes.
 * @param {string} str String
 * @returns {!Array.<number>} UTF8 bytes
 * @inner
 */

export const stringToBytes = (str: string): number[] => {
  const out: number[] = [];
  let i = 0;

  encodeUTF16toUTF8(
    () => (i >= str.length ? null : str.charCodeAt(i++)),
    (b: number) => {
      out.push(b);
    }
  );

  return out;
};

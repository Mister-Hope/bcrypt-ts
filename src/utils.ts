import { encodeUTF16toUTF8 } from "./utfx.js";

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

/**
 * @private
 *
 * Converts a JavaScript string to UTF8 bytes.
 *
 * @param str String
 * @returns UTF8 bytes
 */
export const stringToBytes = (str: string): number[] => {
  let index = 0;
  const bytes: number[] = [];

  encodeUTF16toUTF8(
    () => (index < str.length ? str.charCodeAt(index++) : null),
    (byte) => {
      bytes.push(byte);
    },
  );

  return bytes;
};

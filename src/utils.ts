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
 * Generates cryptographically secure random bytes.
 *
 * @param length Bytes length
 * @returns Random bytes
 * @throws {Error} If no random implementation is available
 */
export const random = (length: number): number[] => {
  /* node */ if (typeof module !== "undefined" && module && module["exports"])
    try {
      // eslint-disable-next-line
      return require("crypto")["randomBytes"](length);
    } catch (err) {
      // do nothing
    }
  /* WCA */ try {
    let array: Uint32Array;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (self["crypto"] || self["msCrypto"])["getRandomValues"](
      (array = new Uint32Array(length))
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Array.prototype.slice.call(array);
  } catch (err) {
    // do nothing
  }

  throw Error(
    "Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative"
  );
};

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

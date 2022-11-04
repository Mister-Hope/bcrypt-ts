/**
 * @private
 *
 * Generates cryptographically secure random bytes.
 *
 * @param length Bytes length
 * @returns Random bytes
 * @throws {Error} If no random implementation is available
 */
export const random = (length: number): number[] => {
  try {
    let array: Uint32Array;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (self["crypto"] || self["msCrypto"])["getRandomValues"](
      (array = new Uint32Array(length))
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Array.prototype.slice.call(array);
  } catch (err) {
    throw Error("WebCryptoAPI is not available");
  }
};

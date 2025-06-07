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
    const array = new Uint32Array(length);

    globalThis.crypto.getRandomValues(array);

    return Array.from(array);
  } catch {
    throw Error("WebCryptoAPI / globalThis is not available");
  }
};

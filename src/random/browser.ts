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
    const crypto =
      typeof window !== "undefined" ? window.crypto : globalThis.crypto;

    const array = new Uint32Array(length);

    crypto.getRandomValues(array);

    return Array.from(array);
  } catch {
    throw Error("WebCryptoAPI is not available");
  }
};

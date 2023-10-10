declare global {
  interface Window {
    msCrypto?: Crypto;
  }
}

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
    const { crypto, msCrypto } = window;
    const array = new Uint32Array(length);

    (crypto || msCrypto)?.getRandomValues(array);

    return Array.from(array);
  } catch (err) {
    throw Error("WebCryptoAPI is not available");
  }
};

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
    let _crypto: Crypto | undefined;

    if (typeof window !== "undefined") {
      _crypto = window.crypto ?? window.msCrypto;
    } else {
      _crypto = globalThis.crypto;
    }
    
    const array = new Uint32Array(length);

    _crypto?.getRandomValues(array);

    return Array.from(array);
  } catch (err) {
    throw Error("WebCryptoAPI is not available");
  }
};

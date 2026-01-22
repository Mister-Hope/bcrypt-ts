/**
 * Generates cryptographically secure random bytes.
 *
 * @param length Bytes length
 * @returns Random bytes
 * @throws {Error} If no random implementation is available
 */
export const random = (length: number): Buffer | Uint8Array<ArrayBuffer> =>
  globalThis.crypto.getRandomValues(new Uint8Array(length));

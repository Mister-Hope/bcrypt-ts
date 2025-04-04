import { randomBytes } from "node:crypto";

/**
 * @private
 *
 * Generates cryptographically secure random bytes.
 *
 * @param length Bytes length
 * @returns Random bytes
 * @throws {Error} If no random implementation is available
 */
export const random = (length: number): Buffer | Uint8Array<ArrayBuffer> =>
  typeof crypto === "undefined"
    ? randomBytes(length)
    : crypto.getRandomValues(new Uint8Array(length));

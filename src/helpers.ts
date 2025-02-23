import { getUTF8ByteLength } from "./uft8.js";
import { getIllegalArgumentsTypeError } from "./utils.js";

/**
 * Gets the number of rounds used to encrypt the specified hash.
 *
 * @param hash Hash to extract the used number of rounds from
 * @returns Number of rounds used
 * @throws {Error} If `hash` is not a string
 */
export const getRounds = (hash: string): number => {
  if (typeof hash !== "string") throw getIllegalArgumentsTypeError(hash);

  return parseInt(hash.split("$")[2], 10);
};

/**
 * Gets the salt portion from a hash. Does not validate the hash.
 *
 * @param hash Hash to extract the salt from
 * @returns Extracted salt part
 * @throws {Error} If `hash` is not a string or otherwise invalid
 */
export const getSalt = (hash: string): string => {
  if (typeof hash !== "string") throw getIllegalArgumentsTypeError(hash);

  if (hash.length !== 60)
    throw new Error(`Illegal hash length: ${hash.length} != 60`);

  return hash.substring(0, 29);
};

/**
 * Tests if a content will be truncated when hashed, that is its length is
 * greater than 72 bytes when converted to UTF-8.
 * @param content The content to test
 * @returns `true` if truncated, otherwise `false`
 */
export const truncates = (content: string): boolean => {
  if (typeof content !== "string") throw getIllegalArgumentsTypeError(content);

  return getUTF8ByteLength(content) > 72;
};

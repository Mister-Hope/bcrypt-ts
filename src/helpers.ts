/**
 * Gets the number of rounds used to encrypt the specified hash.
 *
 * @param hash Hash to extract the used number of rounds from
 * @returns Number of rounds used
 * @throws {Error} If `hash` is not a string
 */
export const getRounds = (hash: string): number => {
  if (typeof hash !== "string")
    throw new Error(`Illegal arguments: ${typeof hash}`);

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
  if (typeof hash !== "string")
    throw new Error(`Illegal arguments: ${typeof hash}`);

  if (hash.length !== 60)
    throw new Error(`Illegal hash length: ${hash.length} != 60`);

  return hash.substring(0, 29);
};

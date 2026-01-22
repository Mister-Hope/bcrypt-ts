import { nextTick } from "nextTick";

import { hash as hashAsync, hashSync } from "./hash.js";
import { getIllegalArgumentsTypeError } from "./utils.js";

/**
 * Synchronously tests a string against a hash.
 *
 * @param content String to compare
 * @param hash Hash to test against
 */
export const compareSync = (content: string, hash: string): boolean => {
  if (typeof content !== "string" || typeof hash !== "string")
    throw getIllegalArgumentsTypeError(content, hash);

  if (hash.length !== 60) return false;

  return hashSync(content, hash.slice(0, 29)) === hash;
};

/**
 * Asynchronously compares the given data against the given hash.
 *
 * @param content Data to compare
 * @param hash Data to be compared to
 * @param progressCallback Callback successively called with the percentage of rounds completed
 *  (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms.
 */
export const compare = (
  content: string,
  hash: string,
  progressCallback?: (percent: number) => void,
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    if (typeof content !== "string" || typeof hash !== "string") {
      nextTick(() => reject(new Error(`Illegal arguments: ${typeof content}, ${typeof hash}`)));

      return;
    }

    if (hash.length !== 60) {
      nextTick(() => resolve(false));

      return;
    }

    hashAsync(content, hash.slice(0, 29), progressCallback)
      .then((comp) => resolve(comp === hash))
      // oxlint-disable-next-line promise/prefer-await-to-callbacks
      .catch((err: unknown) => reject(err as Error));
  });

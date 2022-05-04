import { hash as hashAsync, hashSync } from "./hash";
import { nextTick } from "./utils";

/**
 * Synchronously tests a string against a hash.
 *
 * @param content String to compare
 * @param hash Hash to test against
 */
export const compareSync = (content: string, hash: string): boolean => {
  if (typeof content !== "string" || typeof hash !== "string")
    throw Error("Illegal arguments: " + typeof content + ", " + typeof hash);
  if (hash.length !== 60) return false;

  return hashSync(content, hash.substring(0, hash.length - 31)) === hash;
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
  progressCallback?: (percent: number) => void
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    if (typeof content !== "string" || typeof hash !== "string") {
      nextTick(() =>
        reject(
          new Error(`Illegal arguments: ${typeof content}, ${typeof hash}`)
        )
      );

      return;
    }

    if (hash.length !== 60) {
      nextTick(() => reject(false));

      return;
    }

    hashAsync(content, hash.substring(0, 29), progressCallback)
      .then((comp) => resolve(comp === hash))
      .catch((err) => reject(err));
  });

import { nextTick } from "nextTick";
import { random } from "random";

import { encodeBase64 } from "./base64.js";
import { BCRYPT_SALT_LEN, GENERATE_SALT_DEFAULT_LOG2_ROUNDS } from "./constant.js";
import { getIllegalArgumentsTypeError } from "./utils.js";

/**
 * Synchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 * @returns Resulting salt
 * @throws {Error} If a random fallback is required but not set
 */
export const genSaltSync = (rounds = GENERATE_SALT_DEFAULT_LOG2_ROUNDS): string => {
  if (typeof rounds !== "number") throw getIllegalArgumentsTypeError(rounds);

  rounds = rounds < 4 ? 4 : Math.min(31, rounds);

  return `$2b$${rounds < 10 ? "0" : ""}${rounds}$${encodeBase64(random(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN)}`;
};

/**
 * Asynchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 * @returns Promise resolving to the resulting salt
 */
export const genSalt = (rounds = GENERATE_SALT_DEFAULT_LOG2_ROUNDS): Promise<string> =>
  new Promise((resolve, reject) =>
    // oxlint-disable-next-line no-promise-executor-return
    nextTick(() => {
      try {
        resolve(genSaltSync(rounds));
      } catch (err) {
        reject(err as Error);
      }
    }),
  );

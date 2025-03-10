// eslint-disable-next-line import-x/no-unresolved
import { random } from "random";

import { encodeBase64 } from "./base64.js";
import {
  BCRYPT_SALT_LEN,
  GENERATE_SALT_DEFAULT_LOG2_ROUNDS,
} from "./constant.js";
import { getIllegalArgumentsTypeError, nextTick } from "./utils.js";

/**
 * Synchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 * @returns Resulting salt
 * @throws {Error} If a random fallback is required but not set
 */
export const genSaltSync = (
  rounds = GENERATE_SALT_DEFAULT_LOG2_ROUNDS,
): string => {
  if (typeof rounds !== "number") throw getIllegalArgumentsTypeError(rounds);

  if (rounds < 4) rounds = 4;
  else if (rounds > 31) rounds = 31;

  const salt = [];

  salt.push("$2b$");
  if (rounds < 10) salt.push("0");
  salt.push(rounds.toString());
  salt.push("$");
  salt.push(encodeBase64(random(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN)); // May throw

  return salt.join("");
};

/**
 * Asynchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 */
export const genSalt = (
  rounds = GENERATE_SALT_DEFAULT_LOG2_ROUNDS,
): Promise<string> => {
  if (typeof rounds !== "number") throw getIllegalArgumentsTypeError(rounds);

  return new Promise((resolve, reject) =>
    nextTick(() => {
      // Pretty thin, but salting is fast enough
      try {
        resolve(genSaltSync(rounds));
      } catch (err) {
        reject(err as Error);
      }
    }),
  );
};

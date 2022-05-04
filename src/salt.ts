import { BCRYPT_SALT_LEN, GENSALT_DEFAULT_LOG2_ROUNDS } from "./constant";
import { encodeBase64 } from "./base64";
import { nextTick, random } from "./utils";
/**
 * Synchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 * @returns Resulting salt
 * @throws {Error} If a random fallback is required but not set
 */
export const genSaltSync = (rounds = GENSALT_DEFAULT_LOG2_ROUNDS): string => {
  if (typeof rounds !== "number")
    throw Error("Illegal arguments: " + typeof rounds);
  if (rounds < 4) rounds = 4;
  else if (rounds > 31) rounds = 31;

  const salt = [];

  salt.push("$2a$");
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
  rounds = GENSALT_DEFAULT_LOG2_ROUNDS
): Promise<string> => {
  if (typeof rounds !== "number")
    throw Error("illegal arguments: " + typeof rounds);

  return new Promise((resolve, reject) =>
    nextTick(() => {
      // Pretty thin, but salting is fast enough
      try {
        resolve(genSaltSync(rounds));
      } catch (err) {
        reject(err);
      }
    })
  );
};

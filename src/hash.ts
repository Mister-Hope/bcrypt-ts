import { decodeBase64, encodeBase64 } from "./base64.js";
import {
  BCRYPT_SALT_LEN,
  C_ORIG,
  GENERATE_SALT_DEFAULT_LOG2_ROUNDS,
} from "./constant.js";
import { crypt } from "./crypt.js";
import { genSalt, genSaltSync } from "./salt.js";
import { convertToUFT8Bytes } from "./uft8.js";

/**
 * Internally hashes a string.
 *
 * @private
 * @param content String to hash
 * @param salt Salt to use
 * @param progressCallback Callback called with the current progress
 */
const _hash = (
  content: string,
  salt: string,
  sync: boolean,
  progressCallback?: (progress: number) => void,
): Promise<string> | string => {
  if (typeof content !== "string" || typeof salt !== "string") {
    const err = new Error("Invalid content / salt: not a string");

    if (!sync) return Promise.reject(err);

    throw err;
  }

  // Validate the salt
  let minor: string;
  let offset: number;

  if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
    const err = new Error("Invalid salt version: " + salt.substring(0, 2));

    if (!sync) return Promise.reject(err);

    throw err;
  }

  if (salt.charAt(2) === "$") {
    minor = String.fromCharCode(0);
    offset = 3;
  } else {
    minor = salt.charAt(2);
    if (
      (minor !== "a" && minor !== "b" && minor !== "y") ||
      salt.charAt(3) !== "$"
    ) {
      const err = Error("Invalid salt revision: " + salt.substring(2, 4));

      if (!sync) return Promise.reject(err);

      throw err;
    }
    offset = 4;
  }

  const roundText = salt.substring(offset, offset + 2);
  const rounds = /\d\d/.test(roundText) ? Number(roundText) : null;

  // Extract number of rounds
  if (rounds === null) {
    const err = new Error("Missing salt rounds");

    if (!sync) return Promise.reject(err);

    throw err;
  }

  if (rounds < 4 || rounds > 31) {
    const err = new Error(`Illegal number of rounds (4-31): ${rounds}`);

    if (!sync) return Promise.reject(err);

    throw err;
  }

  const realSalt = salt.substring(offset + 3, offset + 25);

  content += minor >= "a" ? "\x00" : "";

  const passwordBytes = convertToUFT8Bytes(content),
    saltBytes = decodeBase64(realSalt, BCRYPT_SALT_LEN);

  if (saltBytes.length !== BCRYPT_SALT_LEN) {
    const err = new Error(`Illegal salt: ${realSalt}`);

    if (!sync) return Promise.reject(err);

    throw err;
  }

  /**
   * Finishes hashing.
   * @param bytes Byte array
   */
  const finish = (bytes: number[]): string =>
    `$2${minor >= "a" ? minor : ""}$${rounds < 10 ? "0" : ""}${rounds}$${encodeBase64(
      saltBytes,
      BCRYPT_SALT_LEN,
    )}${encodeBase64(bytes, C_ORIG.length * 4 - 1)}`;

  // Sync
  if (!sync)
    return (
      crypt(
        passwordBytes,
        saltBytes,
        rounds,
        false,
        progressCallback,
      ) as Promise<number[]>
    ).then((bytes) => finish(bytes));

  return finish(
    crypt(passwordBytes, saltBytes, rounds, true, progressCallback) as number[],
  );
};

/**
 * Synchronously generates a hash for the given string.
 *
 * @param contentString String to hash
 * @param salt Salt length to generate or salt to use, default to 10
 * @returns Resulting hash
 */
export const hashSync = (
  contentString: string,
  salt: string | number = GENERATE_SALT_DEFAULT_LOG2_ROUNDS,
): string =>
  _hash(
    contentString,
    typeof salt === "number" ? genSaltSync(salt) : salt,
    true,
  ) as string;

/**
 * Asynchronously generates a hash for the given string.
 *
 * @param contentString String to hash
 * @param salt Salt length to generate or salt to use
 * @param progressCallback Callback successively called with the percentage of rounds completed
 *  (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms.
 */
export const hash = async (
  contentString: string,
  salt: number | string,
  progressCallback?: (progress: number) => void,
): Promise<string> =>
  _hash(
    contentString,
    typeof salt === "number" ? await genSalt(salt) : salt,
    false,
    progressCallback,
  ) as Promise<string>;

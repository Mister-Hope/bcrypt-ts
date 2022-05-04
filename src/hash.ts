import { encodeBase64, decodeBase64 } from "./base64";
import {
  BCRYPT_SALT_LEN,
  C_ORIG,
  GENSALT_DEFAULT_LOG2_ROUNDS,
} from "./constant";
import { crypt } from "./crypt";
import { genSalt, genSaltSync } from "./salt";
import { stringToBytes } from "./utils";

/**
 * Internally hashes a string.
 *
 * @param contentString String to hash
 * @param salt Salt to use, actually never null
 * @param {function(Error, string=)=} callback Callback receiving the error, if any, and the resulting hash. If omitted,
 *  hashing is perormed synchronously.
 *  @param {function(number)=} progressCallback Callback called with the current progress
 * @returns {string|undefined} Resulting hash if callback has been omitted, otherwise `undefined`
 * @inner
 */
function _hash(
  contentString: string,
  salt: string,
  sync: boolean,
  progressCallback?: (progress: number) => void
): Promise<string> | string {
  if (typeof contentString !== "string" || typeof salt !== "string") {
    const err = new Error("Invalid string / salt: Not a string");

    if (sync === false) return Promise.reject(err);

    throw err;
  }

  // Validate the salt
  let minor: string;
  let offset: number;

  if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
    const err = new Error("Invalid salt version: " + salt.substring(0, 2));

    if (sync === false) return Promise.reject(err);

    throw err;
  }
  if (salt.charAt(2) === "$") (minor = String.fromCharCode(0)), (offset = 3);
  else {
    minor = salt.charAt(2);
    if (
      (minor !== "a" && minor !== "b" && minor !== "y") ||
      salt.charAt(3) !== "$"
    ) {
      const err = Error("Invalid salt revision: " + salt.substring(2, 4));

      if (sync === false) return Promise.reject(err);

      throw err;
    }
    offset = 4;
  }

  // Extract number of rounds
  if (salt.charAt(offset + 2) > "$") {
    const err = new Error("Missing salt rounds");

    if (sync === false) return Promise.reject(err);

    throw err;
  }

  const r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10,
    r2 = parseInt(salt.substring(offset + 1, offset + 2), 10),
    rounds = r1 + r2,
    realSalt = salt.substring(offset + 3, offset + 25);

  contentString += minor >= "a" ? "\x00" : "";

  const passwordBytes = stringToBytes(contentString),
    saltBytes = decodeBase64(realSalt, BCRYPT_SALT_LEN);

  /**
   * Finishes hashing.
   * @param bytes Byte array
   */
  const finish = (bytes: number[]): string => {
    const res = [];

    res.push("$2");
    if (minor >= "a") res.push(minor);
    res.push("$");
    if (rounds < 10) res.push("0");
    res.push(rounds.toString());
    res.push("$");
    res.push(encodeBase64(saltBytes, saltBytes.length));
    res.push(encodeBase64(bytes, C_ORIG.length * 4 - 1));

    return res.join("");
  };

  // Sync
  if (sync === false)
    return (
      crypt(
        passwordBytes,
        saltBytes,
        rounds,
        false,
        progressCallback
      ) as Promise<number[]>
    ).then((bytes) => finish(bytes));

  return finish(
    crypt(passwordBytes, saltBytes, rounds, true, progressCallback) as number[]
  );
}

/**
 * Synchronously generates a hash for the given string.
 *
 * @param contentString String to hash
 * @param salt Salt length to generate or salt to use, default to 10
 * @returns Resulting hash
 */
export const hashSync = (
  contentString: string,
  salt: string | number = GENSALT_DEFAULT_LOG2_ROUNDS
): string => {
  if (typeof salt === "number") salt = genSaltSync(salt);
  if (typeof contentString !== "string" || typeof salt !== "string")
    throw Error(
      "Illegal arguments: " + typeof contentString + ", " + typeof salt
    );

  return _hash(contentString, salt, true) as string;
};

/**
 * Asynchronously generates a hash for the given string.
 *
 * @param contentString String to hash
 * @param salt Salt length to generate or salt to use
 * @param progressCallback Callback successively called with the percentage of rounds completed
 *  (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms.
 */
export const hash = function (
  contentString: string,
  salt: number | string,
  progressCallback?: (progress: number) => void
): Promise<string> {
  if (typeof contentString === "string" && typeof salt === "number")
    return genSalt(salt).then(
      (salt) =>
        _hash(contentString, salt, false, progressCallback) as Promise<string>
    );

  if (typeof contentString === "string" && typeof salt === "string")
    return _hash(
      contentString,
      salt,
      false,
      progressCallback
    ) as Promise<string>;

  return Promise.reject(
    new Error(`Illegal arguments: ${typeof contentString}, ${typeof salt}`)
  );
};

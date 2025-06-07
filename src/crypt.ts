import { nextTick } from "@nextTick";

import {
  BCRYPT_SALT_LEN,
  BLOWFISH_NUM_ROUNDS,
  C_ORIG,
  MAX_EXECUTION_TIME,
  P_ORIG,
  S_ORIG,
} from "./constant.js";

// A base64 implementation for the bcrypt algorithm. This is partly non-standard.

const encipher = (
  lr: Int32Array<ArrayBuffer>,
  off: number,
  P: Int32Array<ArrayBuffer>,
  S: Int32Array<ArrayBuffer>,
): Int32Array<ArrayBuffer> => {
  // This is our bottleneck: 1714/1905 ticks / 90% - see profile.txt
  let n: number;
  let l = lr[off];
  let r = lr[off + 1];

  l ^= P[0];

  //The following is an unrolled version of the above loop.
  //Iteration 0
  n = S[l >>> 24];
  n += S[0x100 | ((l >> 16) & 0xff)];
  n ^= S[0x200 | ((l >> 8) & 0xff)];
  n += S[0x300 | (l & 0xff)];
  r ^= n ^ P[1];
  n = S[r >>> 24];
  n += S[0x100 | ((r >> 16) & 0xff)];
  n ^= S[0x200 | ((r >> 8) & 0xff)];
  n += S[0x300 | (r & 0xff)];
  l ^= n ^ P[2];
  //Iteration 1
  n = S[l >>> 24];
  n += S[0x100 | ((l >> 16) & 0xff)];
  n ^= S[0x200 | ((l >> 8) & 0xff)];
  n += S[0x300 | (l & 0xff)];
  r ^= n ^ P[3];
  n = S[r >>> 24];
  n += S[0x100 | ((r >> 16) & 0xff)];
  n ^= S[0x200 | ((r >> 8) & 0xff)];
  n += S[0x300 | (r & 0xff)];
  l ^= n ^ P[4];
  //Iteration 2
  n = S[l >>> 24];
  n += S[0x100 | ((l >> 16) & 0xff)];
  n ^= S[0x200 | ((l >> 8) & 0xff)];
  n += S[0x300 | (l & 0xff)];
  r ^= n ^ P[5];
  n = S[r >>> 24];
  n += S[0x100 | ((r >> 16) & 0xff)];
  n ^= S[0x200 | ((r >> 8) & 0xff)];
  n += S[0x300 | (r & 0xff)];
  l ^= n ^ P[6];
  //Iteration 3
  n = S[l >>> 24];
  n += S[0x100 | ((l >> 16) & 0xff)];
  n ^= S[0x200 | ((l >> 8) & 0xff)];
  n += S[0x300 | (l & 0xff)];
  r ^= n ^ P[7];
  n = S[r >>> 24];
  n += S[0x100 | ((r >> 16) & 0xff)];
  n ^= S[0x200 | ((r >> 8) & 0xff)];
  n += S[0x300 | (r & 0xff)];
  l ^= n ^ P[8];
  //Iteration 4
  n = S[l >>> 24];
  n += S[0x100 | ((l >> 16) & 0xff)];
  n ^= S[0x200 | ((l >> 8) & 0xff)];
  n += S[0x300 | (l & 0xff)];
  r ^= n ^ P[9];
  n = S[r >>> 24];
  n += S[0x100 | ((r >> 16) & 0xff)];
  n ^= S[0x200 | ((r >> 8) & 0xff)];
  n += S[0x300 | (r & 0xff)];
  l ^= n ^ P[10];
  //Iteration 5
  n = S[l >>> 24];
  n += S[0x100 | ((l >> 16) & 0xff)];
  n ^= S[0x200 | ((l >> 8) & 0xff)];
  n += S[0x300 | (l & 0xff)];
  r ^= n ^ P[11];
  n = S[r >>> 24];
  n += S[0x100 | ((r >> 16) & 0xff)];
  n ^= S[0x200 | ((r >> 8) & 0xff)];
  n += S[0x300 | (r & 0xff)];
  l ^= n ^ P[12];
  //Iteration 6
  n = S[l >>> 24];
  n += S[0x100 | ((l >> 16) & 0xff)];
  n ^= S[0x200 | ((l >> 8) & 0xff)];
  n += S[0x300 | (l & 0xff)];
  r ^= n ^ P[13];
  n = S[r >>> 24];
  n += S[0x100 | ((r >> 16) & 0xff)];
  n ^= S[0x200 | ((r >> 8) & 0xff)];
  n += S[0x300 | (r & 0xff)];
  l ^= n ^ P[14];
  //Iteration 7
  n = S[l >>> 24];
  n += S[0x100 | ((l >> 16) & 0xff)];
  n ^= S[0x200 | ((l >> 8) & 0xff)];
  n += S[0x300 | (l & 0xff)];
  r ^= n ^ P[15];
  n = S[r >>> 24];
  n += S[0x100 | ((r >> 16) & 0xff)];
  n ^= S[0x200 | ((r >> 8) & 0xff)];
  n += S[0x300 | (r & 0xff)];
  l ^= n ^ P[16];

  lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
  lr[off + 1] = l;

  return lr;
};

const streamToWord = (
  data: number[],
  offp: number,
): { key: number; offp: number } => {
  let word = 0;

  for (let i = 0; i < 4; ++i) {
    word = (word << 8) | (data[offp] & 0xff);
    offp = (offp + 1) % data.length;
  }

  return { key: word, offp };
};

const key = (
  key: number[],
  P: Int32Array<ArrayBuffer>,
  S: Int32Array<ArrayBuffer>,
): void => {
  const pLength = P.length;
  const sLength = S.length;
  let offp = 0;
  let lr = new Int32Array([0, 0]);
  let sw: {
    key: number;
    offp: number;
  };

  for (let i = 0; i < pLength; i++) {
    sw = streamToWord(key, offp);
    offp = sw.offp;
    P[i] = P[i] ^ sw.key;
  }

  for (let i = 0; i < pLength; i += 2) {
    lr = encipher(lr, 0, P, S);
    P[i] = lr[0];
    P[i + 1] = lr[1];
  }

  for (let i = 0; i < sLength; i += 2) {
    lr = encipher(lr, 0, P, S);
    S[i] = lr[0];
    S[i + 1] = lr[1];
  }
};

/**
 * Expensive key schedule Blowfish.
 */
const expensiveKeyScheduleBlowFish = (
  data: number[],
  key: number[],
  P: Int32Array<ArrayBuffer>,
  S: Int32Array<ArrayBuffer>,
): void => {
  const pLength = P.length;
  const sLength = S.length;
  let offp = 0;
  let lr = new Int32Array([0, 0]);
  let sw: {
    key: number;
    offp: number;
  };

  for (let i = 0; i < pLength; i++) {
    sw = streamToWord(key, offp);
    offp = sw.offp;
    P[i] = P[i] ^ sw.key;
  }

  offp = 0;

  for (let i = 0; i < pLength; i += 2) {
    sw = streamToWord(data, offp);
    offp = sw.offp;
    lr[0] ^= sw.key;
    sw = streamToWord(data, offp);
    offp = sw.offp;
    lr[1] ^= sw.key;
    lr = encipher(lr, 0, P, S);
    P[i] = lr[0];
    P[i + 1] = lr[1];
  }

  for (let i = 0; i < sLength; i += 2) {
    sw = streamToWord(data, offp);
    offp = sw.offp;
    lr[0] ^= sw.key;
    sw = streamToWord(data, offp);
    offp = sw.offp;
    lr[1] ^= sw.key;
    lr = encipher(lr, 0, P, S);
    S[i] = lr[0];
    S[i + 1] = lr[1];
  }
};

/**
 * Internally crypts a string.
 *
 * @param bytes Bytes to crypt
 * @param salt Salt bytes to use
 * @param rounds Number of rounds
 * @param progressCallback Callback called with the current progress
 */
export const crypt = (
  bytes: number[],
  salt: number[],
  rounds: number,
  sync: boolean,
  progressCallback?: (progress: number) => void,
): Promise<number[]> | number[] => {
  const cdata = new Int32Array(C_ORIG);
  const cLength = cdata.length;

  // Validate
  if (rounds < 4 || rounds > 31) {
    const err = new Error(`Illegal number of rounds (4-31): ${rounds}`);

    if (!sync) return Promise.reject(err);

    throw err;
  }

  if (salt.length !== BCRYPT_SALT_LEN) {
    const err = new Error(
      `Illegal salt length: ${salt.length} != ${BCRYPT_SALT_LEN}`,
    );

    if (!sync) return Promise.reject(err);

    throw err;
  }

  rounds = (1 << rounds) >>> 0;

  const P = new Int32Array(P_ORIG);
  const S = new Int32Array(S_ORIG);

  expensiveKeyScheduleBlowFish(salt, bytes, P, S);

  let round = 0;

  /**
   * Calculates the next round.
   */
  const next = (): Promise<number[] | void> | number[] | void => {
    if (progressCallback) progressCallback(round / rounds);

    if (round < rounds) {
      const start = Date.now();

      while (round < rounds) {
        round += 1;
        key(bytes, P, S);
        key(salt, P, S);
        if (Date.now() - start > MAX_EXECUTION_TIME) break;
      }
    } else {
      for (let i = 0; i < 64; i++)
        for (let j = 0; j < cLength >> 1; j++) encipher(cdata, j << 1, P, S);
      const result: number[] = [];

      for (let i = 0; i < cLength; i++) {
        result.push(((cdata[i] >> 24) & 0xff) >>> 0);
        result.push(((cdata[i] >> 16) & 0xff) >>> 0);
        result.push(((cdata[i] >> 8) & 0xff) >>> 0);
        result.push((cdata[i] & 0xff) >>> 0);
      }

      if (!sync) return Promise.resolve(result);

      return result;
    }

    if (!sync)
      return new Promise((resolve) =>
        nextTick(() => {
          void (next() as Promise<number[] | undefined>).then(resolve);
        }),
      );
  };

  if (!sync) return next() as Promise<number[]>;

  let result;

  do {
    result = next() as number[] | undefined;
  } while (!result);

  return result;
};

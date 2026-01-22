// oxlint-disable prefer-destructuring
import { nextTick } from "nextTick";

import { BLOWFISH_NUM_ROUNDS, C_ORIG, MAX_EXECUTION_TIME, P_ORIG, S_ORIG } from "./constant.js";

// A base64 implementation for the bcrypt algorithm. This is partly non-standard.

// oxlint-disable-next-line max-statements
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

const streamToWord = (data: number[], offp: number): { key: number; offp: number } => {
  let word = 0;

  for (let i = 0; i < 4; ++i) {
    word = (word << 8) | (data[offp] & 0xff);
    offp = (offp + 1) % data.length;
  }

  return { key: word, offp };
};

const key = (key: number[], P: Int32Array<ArrayBuffer>, S: Int32Array<ArrayBuffer>): void => {
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
    ({ offp } = sw);
    P[i] ^= sw.key;
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
 *
 * @param data Data bytes
 * @param key Key bytes
 * @param P P-array
 * @param S S-boxes
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
    ({ offp } = sw);
    P[i] ^= sw.key;
  }

  offp = 0;

  for (let i = 0; i < pLength; i += 2) {
    sw = streamToWord(data, offp);
    ({ offp } = sw);
    lr[0] ^= sw.key;
    sw = streamToWord(data, offp);
    ({ offp } = sw);
    lr[1] ^= sw.key;
    lr = encipher(lr, 0, P, S);
    P[i] = lr[0];
    P[i + 1] = lr[1];
  }

  for (let i = 0; i < sLength; i += 2) {
    sw = streamToWord(data, offp);
    ({ offp } = sw);
    lr[0] ^= sw.key;
    sw = streamToWord(data, offp);
    ({ offp } = sw);
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
 * @param sync Whether to run synchronously
 *
 * @returns Crypted bytes
 */
// oxlint-disable-next-line max-params
export const crypt = (
  bytes: number[],
  salt: number[],
  rounds: number,
  sync: boolean,
  progressCallback?: (progress: number) => void,
): Promise<number[]> | number[] => {
  const cdata = new Int32Array(C_ORIG);
  const cLength = cdata.length;

  // oxlint-disable-next-line unicorn/prefer-math-trunc
  rounds = (1 << rounds) >>> 0;

  const P = new Int32Array(P_ORIG);
  const S = new Int32Array(S_ORIG);

  expensiveKeyScheduleBlowFish(salt, bytes, P, S);

  let round = 0;

  /**
   * Calculates the next round.
   *
   * @returns Next round or result
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
      for (let i = 0; i < 64; i++) {
        for (let j = 0; j < cLength >> 1; j++) encipher(cdata, j << 1, P, S);
      }
      const result: number[] = [];

      for (let i = 0; i < cLength; i++) {
        result.push((cdata[i] >> 24) & 0xff);
        result.push((cdata[i] >> 16) & 0xff);
        result.push((cdata[i] >> 8) & 0xff);
        result.push(cdata[i] & 0xff);
      }

      if (!sync) return Promise.resolve(result);

      return result;
    }

    if (!sync) {
      return new Promise((resolve) =>
        // oxlint-disable-next-line no-promise-executor-return
        nextTick(() => {
          void (next() as Promise<number[] | undefined>).then(resolve);
        }),
      );
    }
  };

  if (!sync) return next() as Promise<number[]>;

  let result;

  do {
    result = next() as number[] | undefined;
  } while (!result);

  return result;
};

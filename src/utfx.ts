/**
 * utfx-embeddable (c) 2014 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/utfx for details
 */

export const MAX_CODEPOINT = 0x10ffff;

/**
 * Encodes UTF8 code points to UTF8 bytes.
 * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
 *  respectively `null` if there are no more code points left or a single numeric code point.
 * @param {!function(number)} dst Bytes destination as a function successively called with the next byte
 */
export const encodeUTF8 = (
  src: number | (() => number | null),
  dst: (byte: number) => void
): void => {
  let cp = null;

  if (typeof src === "number") (cp = src), (src = (): null => null);

  while (cp !== null || (cp = src()) !== null) {
    if (cp < 0x80) dst(cp & 0x7f);
    else if (cp < 0x800)
      dst(((cp >> 6) & 0x1f) | 0xc0), dst((cp & 0x3f) | 0x80);
    else if (cp < 0x10000)
      dst(((cp >> 12) & 0x0f) | 0xe0),
        dst(((cp >> 6) & 0x3f) | 0x80),
        dst((cp & 0x3f) | 0x80);
    else
      dst(((cp >> 18) & 0x07) | 0xf0),
        dst(((cp >> 12) & 0x3f) | 0x80),
        dst(((cp >> 6) & 0x3f) | 0x80),
        dst((cp & 0x3f) | 0x80);
    cp = null;
  }
};

/**
 * Decodes UTF8 bytes to UTF8 code points.
 *
 * @param src Bytes source as a function returning the next byte respectively `null` if there
 *  are no more bytes left.
 * @param dst Code points destination as a function successively called with each decoded code point.
 * @throws {RangeError} If a starting byte is invalid in UTF8
 * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the
 *  remaining bytes.
 */
export const decodeUTF8 = (
  src: () => number | null,
  dst: (byte: number) => void
): void => {
  let a: number | null;
  let b: number | null;
  let c: number | null;
  let d: number | null;

  const fail = (b: (number | null)[]): void => {
    b = b.slice(0, b.indexOf(null));

    const err = Error(b.toString());

    err.name = "TruncatedError";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    err["bytes"] = b;

    throw err;
  };

  while ((a = src()) !== null) {
    if ((a & 0x80) === 0) dst(a);
    else if ((a & 0xe0) === 0xc0)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (b = src()) === null && fail([a, b]), dst(((a & 0x1f) << 6) | (b & 0x3f));
    else if ((a & 0xf0) === 0xe0)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ((b = src()) === null || (c = src()) === null) && fail([a, b, c]),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dst(((a & 0x0f) << 12) | ((b & 0x3f) << 6) | (c & 0x3f));
    else if ((a & 0xf8) === 0xf0)
      ((b = src()) === null || (c = src()) === null || (d = src()) === null) &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fail([a, b, c, d]),
        dst(
          ((a & 0x07) << 18) |
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ((b & 0x3f) << 12) |
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ((c & 0x3f) << 6) |
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (d & 0x3f)
        );
    else throw RangeError(`Illegal starting byte: ${a}`);
  }
};

/**
 * Converts UTF16 characters to UTF8 code points.
 * @param {!function():number|null} src Characters source as a function returning the next char code respectively
 *  `null` if there are no more characters left.
 * @param {!function(number)} dst Code points destination as a function successively called with each converted code
 *  point.
 */
export const UTF16toUTF8 = (
  src: () => number | null,
  dst: (byte: number) => void
): void => {
  let c1: number | null;
  let c2 = null;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if ((c1 = c2 !== null ? c2 : src()) === null) break;
    if (c1 >= 0xd800 && c1 <= 0xdfff) {
      if ((c2 = src()) !== null) {
        if (c2 >= 0xdc00 && c2 <= 0xdfff) {
          dst((c1 - 0xd800) * 0x400 + c2 - 0xdc00 + 0x10000);
          c2 = null;
          continue;
        }
      }
    }
    dst(c1);
  }
  if (c2 !== null) dst(c2);
};

/**
 * Converts UTF8 code points to UTF16 characters.
 *
 * @param src Code points source, either as a function returning the next code point
 *  respectively `null` if there are no more code points left or a single numeric code point.
 * @param dst Characters destination as a function successively called with each converted char code.
 * @throws {RangeError} If a code point is out of range
 */
export const UTF8toUTF16 = (
  src: (() => number | null) | number,
  dst: (byte: number) => void
): void => {
  let cp = null;

  if (typeof src === "number") (cp = src), (src = (): null => null);

  while (cp !== null || (cp = src()) !== null) {
    if (cp <= 0xffff) dst(cp);
    else (cp -= 0x10000), dst((cp >> 10) + 0xd800), dst((cp % 0x400) + 0xdc00);
    cp = null;
  }
};

/**
 * Converts and encodes UTF16 characters to UTF8 bytes.
 * @param {!function():number|null} src Characters source as a function returning the next char code respectively `null`
 *  if there are no more characters left.
 * @param {!function(number)} dst Bytes destination as a function successively called with the next byte.
 */
export const encodeUTF16toUTF8 = (
  src: () => number | null,
  dst: (byte: number) => void
): void => {
  UTF16toUTF8(src, function (cp) {
    encodeUTF8(cp, dst);
  });
};

/**
 * Decodes and converts UTF8 bytes to UTF16 characters.
 * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
 *  are no more bytes left.
 * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
 * @throws {RangeError} If a starting byte is invalid in UTF8
 * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the remaining bytes.
 */
export const decodeUTF8toUTF16 = (
  src: () => number | null,
  dst: (byte: number) => void
): void => {
  decodeUTF8(src, (cp) => {
    UTF8toUTF16(cp, dst);
  });
};

/**
 * Calculates the byte length of an UTF8 code point.
 *
 * @param codePoint UTF8 code point
 * @returns Byte length
 */
export const calculateCodePoint = (codePoint: number): number =>
  codePoint < 0x80 ? 1 : codePoint < 0x800 ? 2 : codePoint < 0x10000 ? 3 : 4;

/**
 * Calculates the number of UTF8 bytes required to store UTF8 code points.
 * @param src Code points source as a function returning the next code point respectively
 *  `null` if there are no more code points left.
 * @returns The number of UTF8 bytes required
 */
export const calculateUTF8 = (src: () => number | null): number => {
  let cp: number | null;
  let l = 0;

  while ((cp = src()) !== null) l += calculateCodePoint(cp);

  return l;
};

/**
 * Calculates the number of UTF8 code points respectively UTF8 bytes required to store UTF16 char codes.
 * @param src Characters source as a function returning the next char code respectively
 *  `null` if there are no more characters left.
 * @returns The number of UTF8 code points at index 0 and the number of UTF8 bytes required at index 1.
 */
export const calculateUTF16asUTF8 = (src: () => number | null): number[] => {
  let n = 0,
    l = 0;

  UTF16toUTF8(src, function (cp) {
    ++n;
    l += calculateCodePoint(cp);
  });

  return [n, l];
};

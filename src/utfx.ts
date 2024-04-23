/**
 * utfx-embeddable (c) 2014 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/utfx for details
 */

export const MAX_CODEPOINT = 0x10ffff;

/**
 * Encodes UTF8 code points to UTF8 bytes.
 * @param nextByte Code points source, either as a function returning the next code point
 *  respectively `null` if there are no more code points left or a single numeric code point.
 * @param destination Bytes destination as a function successively called with the next byte
 */
export const encodeUTF8 = (
  nextByte: number | (() => number | null),
  destination: (byte: number) => void,
): void => {
  let cp = null;

  if (typeof nextByte === "number")
    (cp = nextByte), (nextByte = (): null => null);

  while (cp !== null || (cp = nextByte()) !== null) {
    if (cp < 0x80) destination(cp & 0x7f);
    else if (cp < 0x800)
      destination(((cp >> 6) & 0x1f) | 0xc0), destination((cp & 0x3f) | 0x80);
    else if (cp < 0x10000)
      destination(((cp >> 12) & 0x0f) | 0xe0),
        destination(((cp >> 6) & 0x3f) | 0x80),
        destination((cp & 0x3f) | 0x80);
    else
      destination(((cp >> 18) & 0x07) | 0xf0),
        destination(((cp >> 12) & 0x3f) | 0x80),
        destination(((cp >> 6) & 0x3f) | 0x80),
        destination((cp & 0x3f) | 0x80);
    cp = null;
  }
};

export class TruncatedError extends Error {
  bytes: number[];
  constructor(...args: number[]) {
    super(args.toString());
    this.bytes = args;
    this.name = "TruncatedError";
  }
}

/**
 * Decodes UTF8 bytes to UTF8 code points.
 *
 * @param nextByte Bytes source as a function returning the next byte respectively `null` if there
 *  are no more bytes left.
 * @param destination Code points destination as a function successively called with each decoded code point.
 * @throws {RangeError} If a starting byte is invalid in UTF8
 * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the
 *  remaining bytes.
 */
export const decodeUTF8 = (
  nextByte: () => number | null,
  destination: (byte: number) => void,
): void => {
  let firstByte = nextByte();
  let secondByte: number | null;
  let thirdByte: number | null;
  let fourthByte: number | null;

  while (firstByte !== null) {
    if ((firstByte & 0x80) === 0) {
      destination(firstByte);
    } else if ((firstByte & 0xe0) === 0xc0) {
      secondByte = nextByte();
      if (secondByte === null) throw new TruncatedError(firstByte);
      destination(((firstByte & 0x1f) << 6) | (secondByte & 0x3f));
    } else if ((firstByte & 0xf0) === 0xe0) {
      secondByte = nextByte();
      if (secondByte === null) throw new TruncatedError(firstByte);
      thirdByte = nextByte();
      if (thirdByte === null) throw new TruncatedError(firstByte, secondByte);
      destination(
        ((firstByte & 0x0f) << 12) |
          ((secondByte & 0x3f) << 6) |
          (thirdByte & 0x3f),
      );
    } else if ((firstByte & 0xf8) === 0xf0) {
      secondByte = nextByte();
      if (secondByte === null) throw new TruncatedError(firstByte);
      thirdByte = nextByte();
      if (thirdByte === null) throw new TruncatedError(firstByte, secondByte);
      fourthByte = nextByte();
      if (fourthByte === null)
        throw new TruncatedError(firstByte, secondByte, thirdByte);
      destination(
        ((firstByte & 0x07) << 18) |
          ((secondByte & 0x3f) << 12) |
          ((thirdByte & 0x3f) << 6) |
          (fourthByte & 0x3f),
      );
    } else throw RangeError(`Illegal starting byte: ${firstByte}`);

    firstByte = nextByte();
  }
};

/**
 * Converts UTF16 characters to UTF8 code points.
 * @param nextByte Characters source as a function returning the next char code respectively
 *  `null` if there are no more characters left.
 * @param destination Code points destination as a function successively called with each converted code
 *  point.
 */
export const UTF16toUTF8 = (
  nextByte: () => number | null,
  destination: (byte: number) => void,
): void => {
  let c1: number | null;
  let c2 = null;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if ((c1 = c2 !== null ? c2 : nextByte()) === null) break;
    if (c1 >= 0xd800 && c1 <= 0xdfff) {
      if ((c2 = nextByte()) !== null) {
        if (c2 >= 0xdc00 && c2 <= 0xdfff) {
          destination((c1 - 0xd800) * 0x400 + c2 - 0xdc00 + 0x10000);
          c2 = null;
          continue;
        }
      }
    }
    destination(c1);
  }
  if (c2 !== null) destination(c2);
};

/**
 * Converts UTF8 code points to UTF16 characters.
 *
 * @param nextByte Code points source, either as a function returning the next code point
 *  respectively `null` if there are no more code points left or a single numeric code point.
 * @param destination Characters destination as a function successively called with each converted char code.
 * @throws {RangeError} If a code point is out of range
 */
export const UTF8toUTF16 = (
  nextByte: (() => number | null) | number,
  destination: (byte: number) => void,
): void => {
  let codePoint = null;

  if (typeof nextByte === "number")
    (codePoint = nextByte), (nextByte = (): null => null);

  while (codePoint !== null || (codePoint = nextByte()) !== null) {
    if (codePoint <= 0xffff) destination(codePoint);
    else
      (codePoint -= 0x10000),
        destination((codePoint >> 10) + 0xd800),
        destination((codePoint % 0x400) + 0xdc00);
    codePoint = null;
  }
};

/**
 * Converts and encodes UTF16 characters to UTF8 bytes.
 * @param nextByte Characters source as a function returning the next char code respectively `null`
 *  if there are no more characters left.
 * @param destination Bytes destination as a function successively called with the next byte.
 */
export const encodeUTF16toUTF8 = (
  nextByte: () => number | null,
  destination: (byte: number) => void,
): void =>
  UTF16toUTF8(nextByte, (codePoint) => {
    encodeUTF8(codePoint, destination);
  });

/**
 * Decodes and converts UTF8 bytes to UTF16 characters.
 * @param nextByte Bytes source as a function returning the next byte respectively `null` if there
 *  are no more bytes left.
 * @param destination Characters destination as a function successively called with each converted char code.
 * @throws {RangeError} If a starting byte is invalid in UTF8
 * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the remaining bytes.
 */
export const decodeUTF8toUTF16 = (
  nextByte: () => number | null,
  destination: (byte: number) => void,
): void =>
  decodeUTF8(nextByte, (codePoint) => {
    UTF8toUTF16(codePoint, destination);
  });

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
  let codePoint: number | null;
  let length = 0;

  while ((codePoint = src()) !== null) length += calculateCodePoint(codePoint);

  return length;
};

/**
 * Calculates the number of UTF8 code points respectively UTF8 bytes required to store UTF16 char codes.
 * @param nextCharCode Characters source as a function returning the next char code respectively
 *  `null` if there are no more characters left.
 * @returns The number of UTF8 code points at index 0 and the number of UTF8 bytes required at index 1.
 */
export const calculateUTF16asUTF8 = (
  nextCharCode: () => number | null,
): number[] => {
  let charIndexStart = 0,
    charIndexEnd = 0;

  UTF16toUTF8(nextCharCode, (codePoint) => {
    ++charIndexStart;
    charIndexEnd += calculateCodePoint(codePoint);
  });

  return [charIndexStart, charIndexEnd];
};

import { BASE64_CODE, BASE64_INDEX } from "./constant.js";

/**
 * Encodes a byte array to base64 with up to length bytes of input, using the custom bcrypt alphabet.
 *
 * @param byteArray Byte array
 * @param length Maximum input length
 */
export const encodeBase64 = (
  byteArray: number[] | Buffer,
  length: number,
): string => {
  if (length <= 0 || length > byteArray.length)
    throw Error(`Illegal length: ${length}`);

  let off = 0;
  let c1: number;
  let c2: number;
  const result: string[] = [];

  while (off < length) {
    c1 = byteArray[off++] & 0xff;
    result.push(BASE64_CODE[(c1 >> 2) & 0x3f]);
    c1 = (c1 & 0x03) << 4;
    if (off >= length) {
      result.push(BASE64_CODE[c1 & 0x3f]);
      break;
    }
    c2 = byteArray[off++] & 0xff;
    c1 |= (c2 >> 4) & 0x0f;
    result.push(BASE64_CODE[c1 & 0x3f]);
    c1 = (c2 & 0x0f) << 2;
    if (off >= length) {
      result.push(BASE64_CODE[c1 & 0x3f]);
      break;
    }
    c2 = byteArray[off++] & 0xff;
    c1 |= (c2 >> 6) & 0x03;
    result.push(BASE64_CODE[c1 & 0x3f]);
    result.push(BASE64_CODE[c2 & 0x3f]);
  }

  return result.join("");
};

/**
 * Decodes a base64 encoded string to up to len bytes of output, using the custom bcrypt alphabet.
 *
 * @param contentString String to decode
 * @param length Maximum output length
 */
export const decodeBase64 = (
  contentString: string,
  length: number,
): number[] => {
  if (length <= 0) throw Error(`Illegal length: ${length}`);

  const stringLength = contentString.length;
  let off = 0;
  let olen = 0;
  let c1: number;
  let c2: number;
  let c3: number;
  let c4: number;
  let o: number;
  let code: number;
  const result: string[] = [];

  while (off < stringLength - 1 && olen < length) {
    code = contentString.charCodeAt(off++);
    c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    code = contentString.charCodeAt(off++);
    c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;

    if (c1 === -1 || c2 === -1) break;

    o = (c1 << 2) >>> 0;
    o |= (c2 & 0x30) >> 4;
    result.push(String.fromCharCode(o));

    if (++olen >= length || off >= stringLength) break;

    code = contentString.charCodeAt(off++);
    c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c3 === -1) break;
    o = ((c2 & 0x0f) << 4) >>> 0;
    o |= (c3 & 0x3c) >> 2;
    result.push(String.fromCharCode(o));

    if (++olen >= length || off >= stringLength) break;

    code = contentString.charCodeAt(off++);
    c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    o = ((c3 & 0x03) << 6) >>> 0;
    o |= c4;
    result.push(String.fromCharCode(o));

    ++olen;
  }

  return result.map((item) => item.charCodeAt(0));
};

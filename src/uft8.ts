const encoder = new TextEncoder();

/** Calculates the byte length of a string encoded as UTF8. */
export const getUTF8ByteLength = (content: string): number => {
  let length = 0,
    charCodePoint = 0;

  for (let i = 0; i < content.length; ++i) {
    charCodePoint = content.charCodeAt(i);
    if (charCodePoint < 128) length += 1;
    else if (charCodePoint < 2048) length += 2;
    else if (
      (charCodePoint & 0xfc00) === 0xd800 &&
      (content.charCodeAt(i + 1) & 0xfc00) === 0xdc00
    ) {
      i++;
      length += 4;
    } else length += 3;
  }

  return length;
};

/** Converts a string to an array of UTF8 bytes. */
export const convertToUFT8Bytes = (content: string): Uint8Array =>
  encoder.encode(content);

/** Converts a string to an array of UTF8 bytes. */
export const oldConvertToUFT8Bytes = (content: string): number[] => {
  let offset = 0,
    c1,
    c2;
  const buffer = new Array<number>(getUTF8ByteLength(content));

  for (let i = 0, k = content.length; i < k; ++i) {
    c1 = content.charCodeAt(i);
    if (c1 < 128) {
      buffer[offset++] = c1;
    } else if (c1 < 2048) {
      buffer[offset++] = (c1 >> 6) | 192;
      buffer[offset++] = (c1 & 63) | 128;
    } else if (
      (c1 & 0xfc00) === 0xd800 &&
      ((c2 = content.charCodeAt(i + 1)) & 0xfc00) === 0xdc00
    ) {
      c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
      ++i;
      buffer[offset++] = (c1 >> 18) | 240;
      buffer[offset++] = ((c1 >> 12) & 63) | 128;
      buffer[offset++] = ((c1 >> 6) & 63) | 128;
      buffer[offset++] = (c1 & 63) | 128;
    } else {
      buffer[offset++] = (c1 >> 12) | 224;
      buffer[offset++] = ((c1 >> 6) & 63) | 128;
      buffer[offset++] = (c1 & 63) | 128;
    }
  }

  return buffer;
};

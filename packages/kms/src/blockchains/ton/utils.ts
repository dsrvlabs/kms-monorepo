// https://github.com/ton-community/ton/blob/master/src/utils/crc16.ts
export const crc16 = (data: Uint8Array) => {
  const poly = 0x1021;
  let reg = 0;
  const message = Buffer.alloc(data.length + 2);
  message.set(data);
  // eslint-disable-next-line no-restricted-syntax
  for (const byte of message) {
    let mask = 0x80;
    while (mask > 0) {
      // eslint-disable-next-line no-bitwise
      reg <<= 1;
      // eslint-disable-next-line no-bitwise
      if (byte & mask) {
        reg += 1;
      }
      // eslint-disable-next-line no-bitwise
      mask >>= 1;
      if (reg > 0xffff) {
        // eslint-disable-next-line no-bitwise
        reg &= 0xffff;
        // eslint-disable-next-line no-bitwise
        reg ^= poly;
      }
    }
  }
  return Buffer.from([Math.floor(reg / 256), reg % 256]);
};

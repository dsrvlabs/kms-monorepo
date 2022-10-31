/* eslint-disable no-plusplus */
const hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
export const bytesToHex = (uint8a) => {
  // pre-caching improves the speed 6x
  if (!(uint8a instanceof Uint8Array)) throw new Error('Uint8Array expected');
  let hex = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < uint8a.length; i++) {
    hex += hexes[uint8a[i]];
  }
  return hex;
};

export const stringToHex = (str) => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
};

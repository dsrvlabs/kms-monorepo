export function padToEven(value: string): string {
  let a = value;

  if (typeof a !== 'string') {
    throw new Error(`[padToEven] value must be type 'string', received ${typeof a}`);
  }

  if (a.length % 2) a = `0${a}`;

  return a;
}

export function isHexString(value: string) {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  return true;
}

export function addHexPrefix(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }
  return isHexString(str) ? str : `0x${padToEven(str)}`;
}

export function stripHexPrefix(str: string): string {
  if (typeof str !== 'string')
    throw new Error(`[stripHexPrefix] input must be type 'string', received ${typeof str}`);
  return padToEven(isHexString(str) ? str.slice(2) : str);
}

export const stringToHex = (str: string) => {
  return addHexPrefix(Buffer.from(str, 'utf8').toString('hex'));
};

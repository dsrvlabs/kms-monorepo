// https://github.com/LedgerHQ/ledgerjs/blob/master/packages/hw-app-tezos/src/Tezos.ts
import bs58check from "bs58check";

const blake2b = require("blake2b");

export const encodeAddress = (publicKey: Buffer) => {
  const pkhB58Prefix = Buffer.from([6, 161, 159]);
  const key = publicKey;
  const keyHashSize = 20;
  let hash = blake2b(keyHashSize);
  hash.update(key);
  hash.digest((hash = Buffer.alloc(keyHashSize)));
  const address = bs58check.encode(Buffer.concat([pkhB58Prefix, hash]));
  return address;
};

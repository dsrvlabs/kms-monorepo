import { sha256 } from '@noble/hashes/sha256';

import { DATA_HEADER, DATA_TAIL, ROOT_HEADER } from './constants';
import { crc16 } from './utils';

// https://github.com/ton-community/ton-ledger-ts/blob/main/source/TonTransport.ts#L109
export const addressFromPubkey = (publicKey: Buffer) => {
  // From ledger
  // https://github.com/LedgerHQ/app-ton-new/blob/develop/src/address.c

  // Hash init data cell bits
  // https://github.com/LedgerHQ/app-ton-new/blob/d5746358778cd2b8e178749890fcbc2f24b1b7c2/src/address.c#L139
  /*
  cx_sha256_init(&state);
  cx_hash((cx_hash_t *) &state, 0, data_header, sizeof(data_header), NULL, 0);
  cx_hash((cx_hash_t *) &state, 0, public_key, 32, NULL, 0);
  cx_hash((cx_hash_t *) &state, CX_LAST, data_tail, sizeof(data_tail), inner, sizeof(inner));
  */

  const inner = sha256(Buffer.concat([DATA_HEADER, publicKey, DATA_TAIL]));

  // Hash root
  // https://github.com/LedgerHQ/app-ton-new/blob/d5746358778cd2b8e178749890fcbc2f24b1b7c2/src/address.c#L145
  /*
  cx_sha256_init(&state);
  cx_hash((cx_hash_t *) &state, 0, root_header, sizeof(root_header), NULL, 0);
  cx_hash((cx_hash_t *) &state, CX_LAST, inner, sizeof(inner), hash, sizeof(hash));
  */
  // let hash = sha256.array(root_header);
  const hash = sha256(Buffer.concat([Buffer.from(ROOT_HEADER), Buffer.from(inner)]));

  // https://github.com/LedgerHQ/app-ton-new/blob/d5746358778cd2b8e178749890fcbc2f24b1b7c2/src/address.c#L91
  // address_to_friendly
  const chain = 0x00;
  const bounceable = true;
  // https://github.com/ton-community/ton-core/blob/5ea9ae23aaee2d84f244561f549d78c101600abd/src/address/Address.ts#L137
  const addr = new Uint8Array(34);

  // Address Tag
  addr[0] = bounceable ? 0x11 : 0x51;

  // Workchain
  addr[1] = chain;

  // Hash
  addr.set(hash, 2);

  // crc16
  // https://github.com/LedgerHQ/app-ton-new/blob/d5746358778cd2b8e178749890fcbc2f24b1b7c2/src/address.c#L117
  // https://github.com/ton-community/ton-core/blob/5ea9ae23aaee2d84f244561f549d78c101600abd/src/address/Address.ts#L141
  const addressWithChecksum = Buffer.alloc(36);
  addressWithChecksum.set(addr);
  addressWithChecksum.set(crc16(addr), 34);

  // const rawAddress = `0:${Buffer.from(addressWithChecksum.slice(2, 34)).toString('hex')}`;

  const friendlyAddress = addressWithChecksum
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return friendlyAddress;
};

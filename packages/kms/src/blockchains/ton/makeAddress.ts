import { sha256 } from 'js-sha256';
import { Address, Cell } from 'ton';
import { DATA_HEADER, DATA_TAIL, ROOT_HEADER } from './constants';
import { crc16 } from './utils';

// https://github.com/ton-community/ton-ledger-ts/blob/main/source/TonTransport.ts#L109
export const addressFromPubkey = (publicKey: Buffer) => {
  // https://github.com/tonwhales/ton-contracts/blob/master/src/contracts/WalletV4Source.ts#L6
  const SOURCE = Buffer.from(
    'te6ccgECFAEAAtQAART/APSkE/S88sgLAQIBIAIDAgFIBAUE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8QERITAubQAdDTAyFxsJJfBOAi10nBIJJfBOAC0x8hghBwbHVnvSKCEGRzdHK9sJJfBeAD+kAwIPpEAcjKB8v/ydDtRNCBAUDXIfQEMFyBAQj0Cm+hMbOSXwfgBdM/yCWCEHBsdWe6kjgw4w0DghBkc3RyupJfBuMNBgcCASAICQB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+ICASAKCwBZvSQrb2omhAgKBrkPoCGEcNQICEekk30pkQzmkD6f+YN4EoAbeBAUiYcVnzGEAgFYDA0AEbjJftRNDXCx+AA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIA4PABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AAG7SB/oA1NQi+QAFyMoHFcv/ydB3dIAYyMsFywIizxZQBfoCFMtrEszMyXP7AMhAFIEBCPRR8qcCAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAAr0AMntVA==',
    'base64',
  );

  // https://github.com/tonwhales/ton-contracts/blob/master/src/contracts/WalletV4Source.ts#L15
  const initialCode = Cell.fromBoc(SOURCE)[0];

  // https://github.com/tonwhales/ton-contracts/blob/master/src/contracts/WalletV4Source.ts#L16
  const initialData = new Cell();
  initialData.bits.writeUint(0, 32);
  initialData.bits.writeUint(698983191, 32);
  initialData.bits.writeBuffer(publicKey);
  initialData.bits.writeBit(0);

  const endCell = new Cell();
  // https://github.com/ton-community/ton/blob/master/src/contracts/contractAddress.ts
  // https://github.com/ton-community/ton/blob/b5f838fc82063d56cbd3a6ab3f515b2c95c791d3/src/messages/StateInit.ts#L23
  endCell.bits.writeBit(0);
  endCell.bits.writeBit(0);
  endCell.bits.writeBit(!!initialCode);
  endCell.bits.writeBit(!!initialData);
  endCell.bits.writeBit(0);

  endCell.refs.push(initialCode);
  endCell.refs.push(initialData);

  const address = new Address(0, endCell.hash());

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

  const inner = sha256.array(Buffer.concat([DATA_HEADER, publicKey, DATA_TAIL]));

  // Hash root
  // https://github.com/LedgerHQ/app-ton-new/blob/d5746358778cd2b8e178749890fcbc2f24b1b7c2/src/address.c#L145
  /*
  cx_sha256_init(&state);
  cx_hash((cx_hash_t *) &state, 0, root_header, sizeof(root_header), NULL, 0);
  cx_hash((cx_hash_t *) &state, CX_LAST, inner, sizeof(inner), hash, sizeof(hash));
  */
  // let hash = sha256.array(root_header);
  const hash = sha256.array(Buffer.concat([Buffer.from(ROOT_HEADER), Buffer.from(inner)]));

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

  // eslint-disable-next-line no-unused-vars
  // const rawAddress = `0:${Buffer.from(addressWithChecksum.slice(2, 34)).toString('hex')}`;

  return address.toFriendly();
};

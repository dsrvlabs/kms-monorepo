import { decode, encode } from 'bs58';
// eslint-disable-next-line camelcase
import { sha3_256 } from '@noble/hashes/sha3';
import { SignKeyPair, sign as naclSign } from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { addHexPrefix } from '../utils';
import { Account, PathOption, SignedTx } from '../../types';
import { getDerivePath, Signer } from '../signer';

export { CHAIN } from '../../types';

const PUBLIC_KEY_SIZE = 32;
const SIGNATURE_SCHEME_TO_FLAG = {
  ED25519: 0x00,
  Secp256k1: 0x01,
};

export class Sui extends Signer {
  static getPrivateKey(pk: string | PathOption): string {
    if (typeof pk === 'string') {
      return pk;
    }
    const { seed } = Signer.getChild(pk);
    const { key } = derivePath(getDerivePath(pk.path)[0], seed.toString('hex'));
    const keyPair = naclSign.keyPair.fromSeed(key);
    return `${encode(Buffer.from(keyPair.secretKey))}`;
  }

  protected static getKeyPair(pk: string | PathOption): SignKeyPair {
    const secretKey = decode(Sui.getPrivateKey(pk));
    const keyPair = naclSign.keyPair.fromSecretKey(secretKey);
    return keyPair;
  }

  static getAccount(pk: string | PathOption): Account {
    const keyPair = Sui.getKeyPair(pk);
    const temp = new Uint8Array(PUBLIC_KEY_SIZE + 1);
    temp.set([SIGNATURE_SCHEME_TO_FLAG.ED25519]);
    temp.set(keyPair.publicKey, 1);
    sha3_256(temp).slice(0, 40);
    return {
      address: addHexPrefix(Buffer.from(sha3_256(temp).slice(0, 20)).toString('hex')),
      publicKey: Buffer.from(keyPair.publicKey).toString('base64'),
    };
  }

  static signTx(pk: string | PathOption, serializedTx: string): SignedTx {
    const keyPair = Sui.getKeyPair(pk);
    const temp = Buffer.from(serializedTx, 'base64');
    const hash = Buffer.from(sha3_256(temp)).toString('base64');
    const signature = Buffer.from(
      naclSign.detached(Buffer.from(serializedTx, 'base64'), keyPair.secretKey),
    ).toString('base64');
    return {
      serializedTx,
      hash,
      signature: signature.toString(),
    };
  }
}

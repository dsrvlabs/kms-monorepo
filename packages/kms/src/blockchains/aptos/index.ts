import { decode, encode } from 'bs58';
// eslint-disable-next-line camelcase
import { sha3_256 } from '@noble/hashes/sha3';
import nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { addHexPrefix, stripHexPrefix } from '../utils';
import { Account, PathOption, SignedTx } from '../../types';
import { getDerivePath, Signer } from '../signer';

export { CHAIN } from '../../types';

export class Aptos extends Signer {
  static getPrivateKey(pk: string | PathOption): string {
    if (typeof pk === 'string') {
      return pk;
    }
    const { seed } = Signer.getChild(pk);
    const { key } = derivePath(getDerivePath(pk.path)[0], seed.toString('hex'));
    const keyPair = nacl.sign.keyPair.fromSeed(key);
    return `${encode(Buffer.from(keyPair.secretKey))}`;
  }

  protected static getKeyPair(pk: string | PathOption): nacl.SignKeyPair {
    const secretKey = decode(Aptos.getPrivateKey(pk));
    const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);
    return keyPair;
  }

  static getAccount(pk: string | PathOption): Account {
    const keyPair = Aptos.getKeyPair(pk);
    // eslint-disable-next-line camelcase
    const hash = sha3_256.create();
    hash.update(Buffer.from(keyPair.publicKey));
    hash.update('\x00');
    return {
      address: addHexPrefix(Buffer.from(hash.digest()).toString('hex')),
      publicKey: addHexPrefix(Buffer.from(keyPair.publicKey).toString('hex')),
    };
  }

  static signTx(pk: string | PathOption, unsignedTx: string): SignedTx {
    super.isHexString(unsignedTx);
    const keyPair = Aptos.getKeyPair(pk);
    const signature = Buffer.from(
      nacl.sign(Buffer.from(stripHexPrefix(unsignedTx), 'hex'), keyPair.secretKey),
    )
      .toString('hex')
      .slice(0, 128);
    return {
      unsignedTx,
      signature: addHexPrefix(signature),
    };
  }
}

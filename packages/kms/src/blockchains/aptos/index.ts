// eslint-disable-next-line camelcase
import { sha3_256 } from '@noble/hashes/sha3';
import { SignKeyPair, sign as naclSign } from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { addHexPrefix, isHexString, stripHexPrefix } from '../utils';
import { Account, PathOption, SignedMsg, SignedTx } from '../../types';
import { getDerivePath, Signer } from '../signer';

export { CHAIN } from '../../types';

function sign(keyPair: SignKeyPair, message: Uint8Array): string {
  const signature = Buffer.from(naclSign(message, keyPair.secretKey).slice(0, 64)).toString('hex');
  return addHexPrefix(signature);
}

export class Aptos extends Signer {
  static getPrivateKey(pk: string | PathOption): string {
    if (typeof pk === 'string') {
      return pk;
    }
    const { seed } = Signer.getChild(pk);
    const { key } = derivePath(getDerivePath(pk.path)[0], seed.toString('hex'));
    const keyPair = naclSign.keyPair.fromSeed(key);
    return addHexPrefix(Buffer.from(keyPair.secretKey).toString('hex').slice(0, 64));
  }

  protected static getKeyPair(pk: string | PathOption): SignKeyPair {
    const keyPair = naclSign.keyPair.fromSeed(
      Buffer.from(stripHexPrefix(Aptos.getPrivateKey(pk)), 'hex'),
    );
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
    const signature = sign(keyPair, Buffer.from(stripHexPrefix(unsignedTx), 'hex'));
    return {
      unsignedTx,
      publicKey: addHexPrefix(Buffer.from(keyPair.publicKey).toString('hex')),
      signature,
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const keyPair = Aptos.getKeyPair(pk);
    const signature = sign(
      keyPair,
      isHexString(message)
        ? Buffer.from(stripHexPrefix(message), 'hex')
        : Buffer.from(message, 'utf8'),
    );
    return {
      message,
      publicKey: addHexPrefix(Buffer.from(keyPair.publicKey).toString('hex')),
      signature,
    };
  }
}

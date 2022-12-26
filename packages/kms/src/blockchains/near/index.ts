import { SignKeyPair, sign as naclSign } from 'tweetnacl';
import { sha256 } from '@noble/hashes/sha256';
import { derivePath } from 'ed25519-hd-key';
import { baseEncode } from 'borsh';
import { addHexPrefix, isHexString, stripHexPrefix } from '../utils';
import { Account, PathOption, SignedMsg, SignedTx } from '../../types';
import { getDerivePath, Signer } from '../signer';

export { CHAIN } from '../../types';

function sign(keyPair: SignKeyPair, message: Uint8Array): string {
  const signature = naclSign.detached(sha256(message), keyPair.secretKey);
  return addHexPrefix(Buffer.from(signature).toString('hex'));
}

export class Near extends Signer {
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
    const keyPair = naclSign.keyPair.fromSecretKey(
      Buffer.from(stripHexPrefix(Near.getPrivateKey(pk)), 'hex'),
    );
    return keyPair;
  }

  static getAccount(pk: string | PathOption): Account {
    const keyPair = Near.getKeyPair(pk);
    const publicKey = `ed25519:${baseEncode(keyPair.publicKey)}`;
    return {
      address: publicKey,
      publicKey,
    };
  }

  static signTx(pk: string | PathOption, unsignedTx: string): SignedTx {
    super.isHexString(unsignedTx);
    const keyPair = Near.getKeyPair(pk);
    const signature = sign(keyPair, Buffer.from(stripHexPrefix(unsignedTx), 'hex'));
    return {
      unsignedTx,
      signature,
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const keyPair = Near.getKeyPair(pk);
    const signature = sign(
      keyPair,
      isHexString(message)
        ? Buffer.from(stripHexPrefix(message), 'hex')
        : Buffer.from(message, 'utf8'),
    );
    return {
      message,
      signature,
      publicKey: `ed25519:${baseEncode(keyPair.publicKey)}`,
    };
  }
}

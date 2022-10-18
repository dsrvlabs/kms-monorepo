import { decode, encode } from 'bs58';
import { SignKeyPair, sign as naclSign } from 'tweetnacl';
import { sha256 } from '@noble/hashes/sha256';
import { derivePath } from 'ed25519-hd-key';
import { baseEncode } from 'borsh';
import { addHexPrefix, isHexString, stripHexPrefix } from '../utils';
import { Account, PathOption, SignedMsg, SignedTx } from '../../types';
import { getDerivePath, Signer } from '../signer';

export { CHAIN } from '../../types';

function sign(keyPair: SignKeyPair, message: Uint8Array): { hash: string; signature: string } {
  const hash = sha256(message);
  const signature = naclSign.detached(
    sha256(message),
    decode(encode(Buffer.from(keyPair.secretKey))),
  );
  return {
    hash: encode(hash),
    signature: addHexPrefix(Buffer.from(signature).toString('hex')),
  };
}

export class Near extends Signer {
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
    const secretKey = decode(Near.getPrivateKey(pk));
    const keyPair = naclSign.keyPair.fromSecretKey(secretKey);
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

  static signTx(pk: string | PathOption, serializedTx: string): SignedTx {
    const keyPair = Near.getKeyPair(pk);
    const { hash, signature } = sign(keyPair, Buffer.from(serializedTx, 'base64'));
    return {
      serializedTx,
      hash,
      signature,
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const keyPair = Near.getKeyPair(pk);
    const { signature } = sign(
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

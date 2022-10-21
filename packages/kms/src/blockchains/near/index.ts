import { decode, encode } from 'bs58';
import nacl from 'tweetnacl';
import { sha256 } from '@noble/hashes/sha256';
import { derivePath } from 'ed25519-hd-key';
import { baseEncode } from 'borsh';
import { addHexPrefix, isHexString, stripHexPrefix } from '../utils';
import { Account, PathOption, SignedMsg, SignedTx } from '../../types';
import { getDerivePath, Signer } from '../signer';

export { CHAIN } from '../../types';

function sign(keyPair: nacl.SignKeyPair, message: Uint8Array): string {
  const signature = nacl.sign.detached(
    sha256(message),
    decode(encode(Buffer.from(keyPair.secretKey))),
  );
  return addHexPrefix(Buffer.from(signature).toString('hex'));
}

export class Near extends Signer {
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
    const secretKey = decode(Near.getPrivateKey(pk));
    const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);
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
    const signature = sign(keyPair, Buffer.from(unsignedTx, 'hex'));
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

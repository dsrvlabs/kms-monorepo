import { decode, encode } from 'bs58';
import { sign as naclSign, SignKeyPair } from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { Account, PathOption, SignedMsg, SignedTx } from '../../types';
import { getDerivePath, Signer } from '../signer';
import { addHexPrefix, isHexString, stripHexPrefix } from '../utils';

export { CHAIN } from '../../types';

function sign(keyPair: SignKeyPair, message: Uint8Array): { hash: string; signature: string } {
  const signature = naclSign.detached(message, keyPair.secretKey);
  return {
    hash: encode(signature),
    signature: addHexPrefix(Buffer.from(signature).toString('hex')),
  };
}

export class Solana extends Signer {
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
    const secretKey = decode(Solana.getPrivateKey(pk));
    const keyPair = naclSign.keyPair.fromSecretKey(secretKey);
    return keyPair;
  }

  static getAccount(pk: string | PathOption): Account {
    const keyPair = Solana.getKeyPair(pk);
    const publicKey = encode(keyPair.publicKey);
    return {
      address: publicKey,
      publicKey,
    };
  }

  static signTx(pk: string | PathOption, serializedTx: string): SignedTx {
    const keyPair = Solana.getKeyPair(pk);
    const { signature, hash } = sign(keyPair, Buffer.from(stripHexPrefix(serializedTx), 'hex'));
    return {
      serializedTx,
      hash,
      signature,
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const keyPair = Solana.getKeyPair(pk);
    const { signature } = sign(
      keyPair,
      isHexString(message)
        ? Buffer.from(stripHexPrefix(message), 'hex')
        : Buffer.from(message, 'utf8'),
    );
    return {
      message,
      signature: signature.slice(0, 130),
      publicKey: encode(keyPair.publicKey),
    };
  }
}

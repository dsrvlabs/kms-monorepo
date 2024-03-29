import { encode } from 'bs58';
import { sign as naclSign, SignKeyPair } from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { Account, PathOption, SignedMsg, SignedTx } from '../../types';
import { getDerivePath, Signer } from '../signer';
import { addHexPrefix, isHexString, stripHexPrefix } from '../utils';

function sign(keyPair: SignKeyPair, message: Uint8Array): { publicKey: string; signature: string } {
  const signature = naclSign.detached(message, keyPair.secretKey);
  return {
    publicKey: addHexPrefix(Buffer.from(keyPair.publicKey).toString('hex')),
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
    return addHexPrefix(Buffer.from(keyPair.secretKey).toString('hex').slice(0, 64));
  }

  static getKeyPair(pk: string | PathOption): SignKeyPair {
    const keyPair = naclSign.keyPair.fromSeed(
      Buffer.from(stripHexPrefix(Solana.getPrivateKey(pk)), 'hex'),
    );
    return keyPair;
  }

  static getAccount(pk: string | PathOption): Account {
    const keyPair = Solana.getKeyPair(pk);
    return {
      address: encode(keyPair.publicKey),
      publicKey: addHexPrefix(Buffer.from(keyPair.publicKey).toString('hex')),
    };
  }

  static signTx(pk: string | PathOption, unsignedTx: string): SignedTx {
    super.isHexString(unsignedTx);
    const keyPair = Solana.getKeyPair(pk);
    const { publicKey, signature } = sign(keyPair, Buffer.from(stripHexPrefix(unsignedTx), 'hex'));
    return {
      unsignedTx,
      publicKey,
      signature,
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const keyPair = Solana.getKeyPair(pk);
    const { publicKey, signature } = sign(
      keyPair,
      isHexString(message)
        ? Buffer.from(stripHexPrefix(message), 'hex')
        : Buffer.from(message, 'utf8'),
    );
    return {
      message,
      publicKey,
      signature: signature.slice(0, 130),
    };
  }
}

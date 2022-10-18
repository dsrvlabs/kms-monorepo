import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { bech32 } from 'bech32';
import { addHexPrefix, isHexString, stripHexPrefix } from '../utils';
import { Account, PathOption, SignedMsg, SignedTx, SimpleKeypair } from '../../types';
import { Signer } from '../signer';

export { CHAIN } from '../../types';

export class Cosmos extends Signer {
  static getPrivateKey(pk: string | PathOption): string {
    if (typeof pk === 'string') {
      return pk;
    }
    const { child } = Signer.getChild(pk);
    return addHexPrefix(child.privateKey?.toString('hex') || '');
  }

  protected static getKeyPair(pk: string | PathOption): SimpleKeypair {
    const privateKey = Buffer.from(stripHexPrefix(Cosmos.getPrivateKey(pk)), 'hex');

    const pair = BIP32Factory(ecc).fromPrivateKey(privateKey, Buffer.alloc(32, 0));

    return {
      privateKey: addHexPrefix(pair.privateKey?.toString('hex') || ''),
      publicKey: addHexPrefix(pair.publicKey.toString('hex') || ''),
    };
  }

  static getAccount(pk: string | PathOption, prefix?: string): Account {
    const keyPair = Cosmos.getKeyPair(pk);

    const temp = Buffer.from(stripHexPrefix(keyPair.publicKey), 'hex');
    const hash = ripemd160(sha256(temp));
    const words = bech32.toWords(hash);
    const addressPrefix = typeof pk === 'string' ? prefix : pk.path.prefix;

    return {
      address: bech32.encode(addressPrefix || 'cosmos', words),
      publicKey: temp.toString('base64'),
    };
  }

  static signTx(pk: string | PathOption, serializedTx: string): SignedTx {
    const { signature } = Cosmos.signMsg(pk, serializedTx);
    return {
      serializedTx,
      signature: Buffer.from(stripHexPrefix(signature || ''), 'hex').toString('base64'),
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const keyPair = Cosmos.getKeyPair(pk);
    const hash = sha256(
      isHexString(message)
        ? Buffer.from(stripHexPrefix(message), 'hex')
        : Buffer.from(message, 'utf8'),
    );
    const { signature } = ecc.signRecoverable(
      hash,
      Buffer.from(stripHexPrefix(keyPair.privateKey), 'hex'),
    );
    return {
      message,
      signature: addHexPrefix(Buffer.from(signature).toString('hex')),
      publicKey: keyPair.publicKey,
    };
  }
}

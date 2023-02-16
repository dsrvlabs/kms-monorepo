import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { bech32 } from 'bech32';
import { addHexPrefix, isHexString, stringToHex, stripHexPrefix } from '../utils';
import { Account, KeyOption, PathOption, SignedMsg, SignedTx, SimpleKeypair } from '../../types';
import { Signer } from '../signer';
import { Ethereum } from '../ethereum';

export { CHAIN } from '../../types';

function sign(keyPair: SimpleKeypair, hashed: Uint8Array): string {
  const { signature } = ecc.signRecoverable(
    hashed,
    Buffer.from(stripHexPrefix(keyPair.privateKey), 'hex'),
  );
  return addHexPrefix(Buffer.from(signature).toString('hex'));
}

export class Cosmos extends Signer {
  static getPrivateKey(pk: string | PathOption): string {
    if (typeof pk === 'string') {
      return pk;
    }
    const { child } = Signer.getChild(pk);
    return addHexPrefix(child.privateKey?.toString('hex') || '');
  }

  static getKeyPair(pk: string | PathOption): SimpleKeypair {
    const privateKey = Buffer.from(stripHexPrefix(Cosmos.getPrivateKey(pk)), 'hex');

    const pair = BIP32Factory(ecc).fromPrivateKey(privateKey, Buffer.alloc(32, 0));

    return {
      privateKey: addHexPrefix(pair.privateKey?.toString('hex') || ''),
      publicKey: addHexPrefix(pair.publicKey.toString('hex') || ''),
    };
  }

  static getAccount(pk: string | PathOption, option?: KeyOption): Account {
    if (option && option.prefix === 'inj') {
      return Ethereum.getAccount(pk, option);
    }

    const keyPair = Cosmos.getKeyPair(pk);
    const temp = Buffer.from(stripHexPrefix(keyPair.publicKey), 'hex');
    const hash = ripemd160(sha256(temp));
    const words = bech32.toWords(hash);
    const prefix = option && option.prefix ? option.prefix : 'cosmos';

    return {
      address: bech32.encode(prefix, words),
      publicKey: addHexPrefix(temp.toString('hex')),
    };
  }

  static signTx(pk: string | PathOption, unsignedTx: string, option?: KeyOption): SignedTx {
    super.isHexString(unsignedTx);
    if (option && option.prefix === 'inj') {
      const signResult = Ethereum.signTx(pk, unsignedTx);
      return {
        ...signResult,
        signature: signResult.signature?.slice(0, 130),
      };
    }

    const keyPair = Cosmos.getKeyPair(pk);
    const hashed = sha256(Buffer.from(stripHexPrefix(unsignedTx), 'hex'));
    const signature = sign(keyPair, hashed);

    return {
      unsignedTx,
      publicKey: keyPair.publicKey,
      signature,
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const keyPair = Cosmos.getKeyPair(pk);
    const msgHex = isHexString(message) ? message : stringToHex(message);
    const hashed = sha256(Buffer.from(stripHexPrefix(msgHex), 'hex'));
    const signature = sign(keyPair, hashed);

    return {
      message,
      publicKey: keyPair.publicKey,
      signature,
    };
  }
}

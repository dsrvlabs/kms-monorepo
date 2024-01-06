import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
// eslint-disable-next-line camelcase
import { keccak_256 } from '@noble/hashes/sha3';
import { hexToBytes } from '@noble/hashes/utils';
import { bech32 } from 'bech32';
import { addHexPrefix, stripHexPrefix } from '../utils';
import { Account, KeyOption, PathOption, SignedTx, SimpleKeypair } from '../../types';
import { Signer } from '../signer';

export class EtherMint extends Signer {
  static getPrivateKey(pk: string | PathOption): string {
    if (typeof pk === 'string') {
      return pk;
    }
    const { child } = Signer.getChild(pk);
    return addHexPrefix(child.privateKey?.toString('hex') || '');
  }

  static getKeyPair(pk: string | PathOption): SimpleKeypair {
    const privateKey = Buffer.from(stripHexPrefix(EtherMint.getPrivateKey(pk)), 'hex');

    const pair = BIP32Factory(ecc).fromPrivateKey(privateKey, Buffer.alloc(32, 0));

    return {
      privateKey: addHexPrefix(pair.privateKey?.toString('hex') || ''),
      publicKey: addHexPrefix(pair.publicKey.toString('hex')),
    };
  }

  static getAccount(pk: string | PathOption, option?: KeyOption): Account {
    const keyPair = EtherMint.getKeyPair(pk);
    const temp = ecc.pointCompress(hexToBytes(stripHexPrefix(keyPair.publicKey)), false).slice(1);

    if (temp.length !== 64) {
      throw new Error('Expected pubKey (hex) to be of length 128');
    }

    const words = bech32.toWords(keccak_256(temp).slice(-20));
    const prefix = option && option.prefix ? option.prefix : 'cosmos';

    const account = {
      address: bech32.encode(prefix, words),
      publicKey: keyPair.publicKey,
    };

    return account;
  }

  static signTx(pk: string | PathOption, unsignedTx: string): SignedTx {
    super.isHexString(unsignedTx);
    const keyPair = EtherMint.getKeyPair(pk);
    const { signature } = ecc.signRecoverable(
      Buffer.from(keccak_256(Buffer.from(stripHexPrefix(unsignedTx), 'hex'))),
      Buffer.from(stripHexPrefix(keyPair.privateKey), 'hex'),
    );
    return {
      unsignedTx,
      publicKey: keyPair.publicKey,
      signature: addHexPrefix(Buffer.from(signature).toString('hex')),
    };
  }
}

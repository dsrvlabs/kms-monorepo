import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
// eslint-disable-next-line camelcase
import { keccak_256 } from '@noble/hashes/sha3';
import { bech32 } from 'bech32';
import { addHexPrefix, stripHexPrefix } from '../utils';
import { Account, KeyOption, PathOption, SignedTx, SimpleKeypair } from '../../types';
import { Signer } from '../signer';

export { CHAIN } from '../../types';

export class Ethereum extends Signer {
  static getPrivateKey(pk: string | PathOption): string {
    if (typeof pk === 'string') {
      return pk;
    }
    const { child } = Signer.getChild(pk);
    return addHexPrefix(child.privateKey?.toString('hex') || '');
  }

  protected static getKeyPair(pk: string | PathOption): SimpleKeypair {
    const privateKey = Buffer.from(stripHexPrefix(Ethereum.getPrivateKey(pk)), 'hex');

    const pair = BIP32Factory(ecc).fromPrivateKey(privateKey, Buffer.alloc(32, 0));

    return {
      privateKey: addHexPrefix(pair.privateKey?.toString('hex') || ''),
      publicKey: addHexPrefix(pair.publicKey.toString('hex')),
    };
  }

  static getAccount(pk: string | PathOption, option?: KeyOption): Account {
    const keyPair = Ethereum.getKeyPair(pk);
    const temp = Buffer.from(
      ecc.pointCompress(Buffer.from(stripHexPrefix(keyPair.publicKey), 'hex'), false),
    )
      .toString('hex')
      .slice(2);

    if (temp.length !== 128) {
      throw new Error('Expected pubKey (hex) to be of length 128');
    }

    const account = {
      address: addHexPrefix(
        Buffer.from(keccak_256(Buffer.from(temp, 'hex')).slice(-20)).toString('hex'),
      ),
      publicKey: keyPair.publicKey,
    };

    if (option && option.prefix === 'inj') {
      const prefix = option && option.prefix ? option.prefix : 'cosmos';
      return {
        address: bech32.encode(
          prefix,
          bech32.toWords(Buffer.from(stripHexPrefix(account.address), 'hex')),
        ),
        publicKey: account.publicKey,
      };
    }

    return account;
  }

  static signTx(pk: string | PathOption, serializedTx: string): SignedTx {
    const keyPair = Ethereum.getKeyPair(pk);
    const { signature, recoveryId: recoveryParam } = ecc.signRecoverable(
      Buffer.from(keccak_256(Buffer.from(stripHexPrefix(serializedTx), 'hex'))),
      Buffer.from(stripHexPrefix(keyPair.privateKey), 'hex'),
    );
    return {
      serializedTx,
      signature: addHexPrefix(
        Buffer.concat([signature, Buffer.from([recoveryParam])]).toString('hex'),
      ),
    };
  }
}

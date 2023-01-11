import { mnemonicToSeedSync } from 'bip39';
import { getPublicKey } from '@noble/bls12-381';
import { Account, KeyOption, PathOption, SimpleKeypair } from '../../types';
import { getDerivePath, Signer } from '../signer';
import { addHexPrefix, stripHexPrefix } from '../utils';
import { deriveChildSKMultiple, hkdfModR } from './bls';

export { CHAIN } from '../../types';

export class Eth2 extends Signer {
  static getPrivateKey(pk: string | PathOption, option: KeyOption): string {
    if (typeof pk === 'string') {
      return pk;
    }
    const indices = getDerivePath(pk.path, option)[0].split('/');
    if (indices.shift() !== 'm') throw new Error('First character of path must be "m"');

    const nodes = indices.map((i) => Number.parseInt(i, 10));
    const seed = mnemonicToSeedSync(pk.mnemonic);
    const masterKey = hkdfModR(seed);

    const pirvateKey = deriveChildSKMultiple(masterKey, nodes);
    return addHexPrefix(Buffer.from(pirvateKey).toString('hex'));
  }

  static getKeyPair(pk: string | PathOption, option: KeyOption): SimpleKeypair {
    const privateKey = Buffer.from(stripHexPrefix(Eth2.getPrivateKey(pk, option)), 'hex');

    return {
      privateKey: addHexPrefix(privateKey.toString('hex')),
      publicKey: addHexPrefix(Buffer.from(getPublicKey(privateKey)).toString('hex')),
    };
  }

  static getAccount(pk: string | PathOption, option: KeyOption): Account {
    const keyPair = Eth2.getKeyPair(pk, option);

    return {
      address: keyPair.publicKey,
      publicKey: keyPair.publicKey,
    };
  }
}

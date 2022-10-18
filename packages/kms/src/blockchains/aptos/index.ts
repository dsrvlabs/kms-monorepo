import { decode, encode } from 'bs58';
// eslint-disable-next-line camelcase
import { sha3_256 } from '@noble/hashes/sha3';
import { SignKeyPair, sign as naclSign } from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { addHexPrefix, stripHexPrefix } from '../utils';
import { Account, PathOption, SignedTx } from '../../types';
import { getDerivePath, Signer } from '../signer';

export { CHAIN } from '../../types';

export class Aptos extends Signer {
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
    const secretKey = decode(Aptos.getPrivateKey(pk));
    const keyPair = naclSign.keyPair.fromSecretKey(secretKey);
    return keyPair;
  }

  static getAccount(pk: string | PathOption): Account {
    const keyPair = Aptos.getKeyPair(pk);
    // eslint-disable-next-line camelcase
    const hash = sha3_256.create();
    hash.update(Buffer.from(keyPair.publicKey));
    hash.update('\x00');
    return {
      address: addHexPrefix(Buffer.from(hash.digest()).toString('hex')),
      publicKey: addHexPrefix(Buffer.from(keyPair.publicKey).toString('hex')),
    };
  }

  static signTx(pk: string | PathOption, serializedTx: string): SignedTx {
    const keyPair = Aptos.getKeyPair(pk);
    const signature = Buffer.from(
      naclSign(Buffer.from(stripHexPrefix(serializedTx), 'hex'), keyPair.secretKey),
    )
      .toString('hex')
      .slice(0, 128);
    const hash = sha3_256(
      Buffer.from(
        // sha3_256(Buffer.from("APTOS::Transaction", "utf8"))
        `fa210a9417ef3e7fa45bfa1d17a8dbd4d883711910a550d265fee189e9266dd400${stripHexPrefix(
          serializedTx,
        ).slice(64)}0020${Buffer.from(keyPair.publicKey).toString('hex')}40${signature}`,
        'hex',
      ),
    );
    return {
      serializedTx,
      hash: addHexPrefix(Buffer.from(hash).toString('hex')),
      signature: addHexPrefix(signature),
    };
  }
}

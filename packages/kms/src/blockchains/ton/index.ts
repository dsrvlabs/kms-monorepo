import { SignKeyPair, sign as naclSign } from 'tweetnacl';
import { baseEncode } from 'borsh';
import { derivePath } from 'ed25519-hd-key';
import { getDerivePath, Signer } from '../signer';
import { Account, PathOption, SignedMsg, SignedTx } from '../../types';
import { addHexPrefix, isHexString, stringToHex, stripHexPrefix } from '../utils';
import { addressFromPubkey } from './makeAddress';

export { CHAIN } from '../../types';

export class Ton extends Signer {
  static async getPrivateKey(pk: string | PathOption): Promise<string> {
    if (typeof pk === 'string') {
      return pk;
    }
    const { seed } = Signer.getChild(pk);
    const { key } = derivePath(getDerivePath(pk.path)[0], seed.toString('hex'));

    const keyPair = naclSign.keyPair.fromSeed(key);
    return addHexPrefix(Buffer.from(keyPair.secretKey).toString('hex'));
  }

  protected static async getKeyPair(pk: string | PathOption): Promise<SignKeyPair> {
    const secretKey = Buffer.from(stripHexPrefix(await Ton.getPrivateKey(pk)), 'hex');
    const keyPair = naclSign.keyPair.fromSecretKey(secretKey);

    return keyPair;
  }

  static async getAccount(pk: string | PathOption): Promise<Account> {
    const keyPair = await Ton.getKeyPair(pk);
    const publicKey = baseEncode(keyPair.publicKey);

    const address = addressFromPubkey(Buffer.from(keyPair.publicKey));

    return {
      address,
      publicKey,
    };
  }

  static async signTx(pk: string | PathOption, unsignedTx: string): Promise<SignedTx> {
    super.isHexString(unsignedTx);

    const keyPair = await Ton.getKeyPair(pk);
    const hash = Buffer.from(stripHexPrefix(unsignedTx), 'hex');
    const signature = naclSign.detached(new Uint8Array(hash), new Uint8Array(keyPair.secretKey));

    return {
      unsignedTx,
      signature: addHexPrefix(Buffer.from(signature).toString('hex')),
    };
  }

  static async signMsg(pk: string | PathOption, message: string): Promise<SignedMsg> {
    const hexMsg = isHexString(message) ? message : stringToHex(message);

    const keyPair = await Ton.getKeyPair(pk);
    const hash = Buffer.from(stripHexPrefix(hexMsg), 'hex');
    const signature = naclSign.detached(new Uint8Array(hash), new Uint8Array(keyPair.secretKey));

    return {
      message,
      signature: addHexPrefix(Buffer.from(signature).toString('hex')),
    };
  }
}

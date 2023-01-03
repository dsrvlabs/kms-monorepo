import { decode, encode } from 'bs58';
import { SignKeyPair, sign as naclSign } from 'tweetnacl';
import { baseEncode } from 'borsh';
import { deriveEd25519Path, keyPairFromSeed } from 'ton-crypto';
import { mnemonicToSeedSync } from 'bip39';
import { Signer } from '../signer';
import { Account, PathOption, SignedMsg, SignedTx } from '../../types';
import { addHexPrefix, isHexString, stringToHex, stripHexPrefix } from '../utils';
import { addressFromPubkey } from './makeAddress';

export { CHAIN } from '../../types';

export class Ton extends Signer {
  static async getPrivateKey(pk: string | PathOption): Promise<string> {
    let mnemonicLedger;

    if (typeof pk === 'string') {
      mnemonicLedger = pk.split(' ');
    } else {
      mnemonicLedger = pk.mnemonic.split(' ');
    }
    const seed = mnemonicToSeedSync(mnemonicLedger.join(' '));
    const pathEd25519 = await deriveEd25519Path(seed, [44, 607, 0, 0, 0, 0]);
    const keyPair = keyPairFromSeed(pathEd25519);

    return `${encode(Buffer.from(keyPair.secretKey))}`;
  }

  protected static async getKeyPair(pk: string | PathOption): Promise<SignKeyPair> {
    const secretKey = decode(await Ton.getPrivateKey(pk));
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

import { blake2b } from '@noble/hashes/blake2b';
import { SignKeyPair, sign as naclSign } from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { addHexPrefix, isHexString, stripHexPrefix } from '../utils';
import { Account, PathOption, SignedMsg, SignedTx } from '../../types';
import { getDerivePath, Signer } from '../signer';

export { CHAIN } from '../../types';

const PUBLIC_KEY_SIZE = 32;
const SUI_ADDRESS_LENGTH = 32;
const SIGNATURE_SCHEME_TO_FLAG = {
  ED25519: 0x00,
  Secp256k1: 0x01,
};

function sign(
  keyPair: SignKeyPair,
  intent: number[],
  data: Buffer,
): { publicKey: string; signature: string } {
  const intentMessage = new Uint8Array(intent.length + data.length);
  intentMessage.set(intent);
  intentMessage.set(data, intent.length);
  const digest = blake2b(intentMessage, { dkLen: 32 });
  const signature = naclSign.detached(digest, keyPair.secretKey);
  const temp = new Uint8Array(1 + signature.length + keyPair.publicKey.length);
  temp.set([SIGNATURE_SCHEME_TO_FLAG.ED25519]);
  temp.set(signature, 1);
  temp.set(keyPair.publicKey, 1 + signature.length);
  return {
    publicKey: addHexPrefix(Buffer.from(keyPair.publicKey).toString('hex')),
    signature: addHexPrefix(Buffer.from(temp).toString('hex')),
  };
}

export class Sui extends Signer {
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
      Buffer.from(stripHexPrefix(Sui.getPrivateKey(pk)), 'hex'),
    );
    return keyPair;
  }

  static getAccount(pk: string | PathOption): Account {
    const keyPair = Sui.getKeyPair(pk);
    const temp = new Uint8Array(PUBLIC_KEY_SIZE + 1);
    temp.set([SIGNATURE_SCHEME_TO_FLAG.ED25519]);
    temp.set(keyPair.publicKey, 1);
    return {
      address: addHexPrefix(
        Buffer.from(blake2b(temp, { dkLen: 32 }).slice(0, SUI_ADDRESS_LENGTH)).toString('hex'),
      ),
      publicKey: addHexPrefix(Buffer.from(keyPair.publicKey).toString('hex')),
    };
  }

  static signTx(pk: string | PathOption, unsignedTx: string): SignedTx {
    super.isHexString(unsignedTx);
    const buffer = Buffer.from(stripHexPrefix(unsignedTx), 'hex');
    const intent = [0, 0, 0]; // IntentScope (TransactionData), IntentVersion (v0), AppId (Sui)
    const { publicKey, signature } = sign(Sui.getKeyPair(pk), intent, buffer);
    return {
      unsignedTx,
      publicKey,
      signature,
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const buffer = isHexString(message)
      ? Buffer.from(stripHexPrefix(message), 'hex')
      : Buffer.from(message, 'utf8');
    const intent = [3, 0, 0]; // IntentScope (PersonalMessage), IntentVersion (v0), AppId (Sui)
    const { publicKey, signature } = sign(Sui.getKeyPair(pk), intent, buffer);
    return {
      message,
      publicKey,
      signature,
    };
  }
}

import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
// eslint-disable-next-line camelcase
import { keccak_256 } from '@noble/hashes/sha3';
import { hexToBytes } from '@noble/hashes/utils';
import { addHexPrefix, isHexString, stringToHex, stripHexPrefix } from '../utils';
import { Account, PathOption, SignedMsg, SignedTx, SimpleKeypair } from '../../types';
import { Signer } from '../signer';

export { CHAIN } from '../../types';

export interface ECDSASignature {
  v: bigint;
  r: Buffer;
  s: Buffer;
}

const hashMessage = (msgHex: string): Uint8Array => {
  const messageBytes = hexToBytes(msgHex.replace('0x', ''));
  const messageBuffer = Buffer.from(stripHexPrefix(msgHex), 'hex');
  const messagePrefix = '\x19Ethereum Signed Message:\n';
  return keccak_256(
    Buffer.concat([
      Buffer.from(messagePrefix),
      Buffer.from(String(messageBytes.length)),
      messageBuffer,
    ]),
  );
};

export class Ethereum extends Signer {
  static getPrivateKey(pk: string | PathOption): string {
    if (typeof pk === 'string') {
      return pk;
    }
    const { child } = Signer.getChild(pk);
    return addHexPrefix(child.privateKey?.toString('hex') || '');
  }

  static getKeyPair(pk: string | PathOption): SimpleKeypair {
    const privateKey = Buffer.from(stripHexPrefix(Ethereum.getPrivateKey(pk)), 'hex');

    const pair = BIP32Factory(ecc).fromPrivateKey(privateKey, Buffer.alloc(32, 0));

    return {
      privateKey: addHexPrefix(pair.privateKey?.toString('hex') || ''),
      publicKey: addHexPrefix(pair.publicKey.toString('hex')),
    };
  }

  static getAccount(pk: string | PathOption): Account {
    const keyPair = Ethereum.getKeyPair(pk);
    const temp = ecc.pointCompress(hexToBytes(stripHexPrefix(keyPair.publicKey)), false).slice(1);

    if (temp.length !== 64) {
      throw new Error('Expected pubKey (hex) to be of length 128');
    }

    const account = {
      address: addHexPrefix(Buffer.from(keccak_256(temp).slice(-20)).toString('hex')),
      publicKey: keyPair.publicKey,
    };

    return account;
  }

  static signTx(pk: string | PathOption, unsignedTx: string): SignedTx {
    super.isHexString(unsignedTx);
    const keyPair = Ethereum.getKeyPair(pk);
    const { signature, recoveryId } = ecc.signRecoverable(
      Buffer.from(keccak_256(Buffer.from(stripHexPrefix(unsignedTx), 'hex'))),
      Buffer.from(stripHexPrefix(keyPair.privateKey), 'hex'),
    );
    return {
      unsignedTx,
      publicKey: keyPair.publicKey,
      signature: addHexPrefix(
        Buffer.concat([signature, Buffer.from([recoveryId])]).toString('hex'),
      ),
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const keyPair = Ethereum.getKeyPair(pk);
    const msgHex = isHexString(message) ? message : stringToHex(message);

    const { signature, recoveryId } = ecc.signRecoverable(
      Buffer.from(hashMessage(msgHex)),
      Buffer.from(stripHexPrefix(keyPair.privateKey), 'hex'),
    );

    return {
      message,
      publicKey: keyPair.publicKey,
      signature: addHexPrefix(
        Buffer.concat([
          signature,
          Buffer.from(BigInt(parseInt(recoveryId.toString(), 10) + 27).toString(16), 'hex'),
        ]).toString('hex'),
      ),
    };
  }
}

import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { ecdsaSign } from 'secp256k1';
// eslint-disable-next-line camelcase
import { keccak_256 } from '@noble/hashes/sha3';
import { bech32 } from 'bech32';
import { hexToBytes } from '@noble/hashes/utils';
import { addHexPrefix, isHexString, stringToHex, stripHexPrefix } from '../utils';
import { Account, KeyOption, PathOption, SignedMsg, SignedTx, SimpleKeypair } from '../../types';
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

const ecsign = (msgHash: Buffer, privateKey: Buffer, chainId?: bigint): ECDSASignature => {
  const { signature, recid } = ecdsaSign(msgHash, privateKey);

  const r = Buffer.from(signature.slice(0, 32));
  const s = Buffer.from(signature.slice(32, 64));

  const v =
    chainId === undefined ? BigInt(recid + 27) : BigInt(recid + 35) + BigInt(chainId) * BigInt(2);

  return { r, s, v };
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

  static signTx(pk: string | PathOption, unsignedTx: string): SignedTx {
    super.isHexString(unsignedTx);
    const keyPair = Ethereum.getKeyPair(pk);
    const { signature, recoveryId: recoveryParam } = ecc.signRecoverable(
      Buffer.from(keccak_256(Buffer.from(stripHexPrefix(unsignedTx), 'hex'))),
      Buffer.from(stripHexPrefix(keyPair.privateKey), 'hex'),
    );
    return {
      unsignedTx,
      signature: addHexPrefix(
        Buffer.concat([signature, Buffer.from([recoveryParam])]).toString('hex'),
      ),
    };
  }

  static signMsg(pk: string | PathOption, message: string): SignedMsg {
    const keyPair = Ethereum.getKeyPair(pk);
    const msgHex = isHexString(message) ? message : stringToHex(message);
    const hashedMessage = hashMessage(msgHex);

    const sig = ecsign(
      Buffer.from(hashedMessage),
      Buffer.from(stripHexPrefix(keyPair.privateKey), 'hex'),
    );
    const signature = Buffer.concat([
      sig.r,
      sig.s,
      Buffer.from(sig.v.toString(16), 'hex'),
    ]).toString('hex');

    return {
      message,
      signature: addHexPrefix(signature),
      publicKey: keyPair.publicKey,
    };
  }
}

/* eslint-disable no-unused-vars */
import { mnemonicToSeedSync } from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { SignKeyPair } from 'tweetnacl';
import {
  Account,
  BIP44,
  CHAIN,
  KeyOption,
  PathOption,
  SignedMsg,
  SignedTx,
  SimpleKeypair,
} from '../types';
import { isHexString } from './utils';

export function getDerivePath(path: BIP44, option?: KeyOption): string[] {
  switch (path.type) {
    case CHAIN.ETHEREUM:
      if (
        option &&
        option.keyType &&
        (option.keyType === 'withdrawal' || option.keyType === 'signing')
      ) {
        return option.keyType === 'withdrawal'
          ? [`m/12381/3600/${path.index}/0`, `m/12381/3600/[INDEX]/0`]
          : [`m/12381/3600/${path.index}/0/0`, `m/12381/3600/[INDEX]/0/0`];
      }
      return [
        `m/44'/${path.type}'/${path.account}'/0/${path.index}`,
        `m/44'/${path.type}'/${path.account}'/0/`,
      ];
    case CHAIN.DSRV:
    case CHAIN.COSMOS:
    case CHAIN.PERSISTENCE:
    case CHAIN.AGORIC:
    case CHAIN.TERRA:
    case CHAIN.KLAYTN:
    case CHAIN.CELO:
    case CHAIN.KUSAMA:
    case CHAIN.POLKADOT:
      return [
        `m/44'/${path.type}'/${path.account}'/0/${path.index}`,
        `m/44'/${path.type}'/${path.account}'/0/`,
      ];
    case CHAIN.FLOW:
      return [`m/44'/1'/${path.type}'/0/${path.index}`, `m/44'/1'/${path.type}'/0/`];
    case CHAIN.NEAR:
    case CHAIN.SUI:
    case CHAIN.APTOS:
      return [
        `m/44'/${path.type}'/${path.account}'/0'/${path.index}'`,
        `m/44'/${path.type}'/${path.account}'/0'/`,
      ];
    case CHAIN.SOLANA:
    case CHAIN.TEZOS:
    case CHAIN.TON:
      // @TODO TON check
      return [
        `m/44'/${path.type}'/${path.account}'/${path.index}'`,
        `m/44'/${path.type}'/${path.account}'/`,
      ];
    // add blockchains....
    // blockchains
    default:
      break;
  }
  return [];
}

export abstract class Signer {
  protected static getChild(option: PathOption) {
    const seed = mnemonicToSeedSync(option.mnemonic);
    const node = BIP32Factory(ecc).fromSeed(seed);
    const child = node.derivePath(getDerivePath(option.path)[0]);

    return { seed, child };
  }

  static getPrivateKey(_pk: string | PathOption, _option?: KeyOption): string {
    throw new Error('not implemented!');
  }

  static isHexString(hex: string) {
    if (!isHexString(hex)) {
      throw new Error('not implemented!');
    }
  }

  protected static getKeyPair(
    _pk: string | PathOption,
    _option?: KeyOption,
  ): SimpleKeypair | SignKeyPair {
    throw new Error('not implemented!');
  }

  static getAccount(_pk: string | PathOption, _option?: KeyOption): Account | Promise<Account> {
    throw new Error('not implemented!');
  }

  static signTx(_pk: string | PathOption, _unsignedTx: string, _option?: KeyOption): SignedTx {
    throw new Error('not implemented!');
  }

  static signMsg(_pk: string | PathOption, _message: string, _option?: KeyOption): SignedMsg {
    throw new Error('not implemented!');
  }
}

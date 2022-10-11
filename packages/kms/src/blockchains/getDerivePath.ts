import { BIP44, CHAIN } from "../types";

export function getDerivePath(path: BIP44): string[] {
  switch (path.type) {
    case CHAIN.DSRV:
    case CHAIN.COSMOS:
    case CHAIN.PERSISTENCE:
    case CHAIN.AGORIC:
    case CHAIN.TERRA:
    case CHAIN.ETHEREUM:
    case CHAIN.KLAYTN:
    case CHAIN.CELO:
    case CHAIN.KUSAMA:
    case CHAIN.POLKADOT:
      return [
        `m/44'/${path.type}'/${path.account}'/0/${path.index}`,
        `m/44'/${path.type}'/${path.account}'/0/`,
      ];
    case CHAIN.FLOW:
      return [
        `m/44'/1'/${path.type}'/0/${path.index}`,
        `m/44'/1'/${path.type}'/0/`,
      ];
    case CHAIN.NEAR:
    case CHAIN.SUI:
    case CHAIN.APTOS:
      return [
        `m/44'/${path.type}'/${path.account}'/0'/${path.index}'`,
        `m/44'/${path.type}'/${path.account}'/0'/`,
      ];
    case CHAIN.SOLANA:
    case CHAIN.TEZOS:
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

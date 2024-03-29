// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
export const CHAIN = {
  DSRV: 8080,
  TERRA: 330,
  FLOW: 539,
  SOLANA: 501,
  NEAR: 397,
  KUSAMA: 434,
  POLKADOT: 354,
  COSMOS: 118,
  ETHEREUM: 60,
  CELO: 52752,
  KLAYTN: 8217,
  TEZOS: 1729,
  PERSISTENCE: 750,
  AGORIC: 564,
  SUI: 784,
  APTOS: 637,
  TON: 607,
  ARBITRUM: 9001,
} as const;

export interface KeyStore {
  t: number;
  m: number;
  s: string;
  j: string[];
}

export interface SimpleKeypair {
  publicKey: string;
  privateKey: string;
}

export interface BIP44 {
  type: number;
  account: number;
  index: number;
}

export interface PathOption {
  path: BIP44;
  mnemonic: string;
}

export interface KeyOption {
  // EIP-2334 specifies following derivation paths:
  // m/12381/3600/0/0   for withdrawal
  // m/12381/3600/0/0/0 for signing
  keyType?: 'withdrawal' | 'signing';

  // cosmos
  prefix?: string;
}

export interface Account {
  address: string;
  publicKey: string;
}

export interface SignedTx {
  unsignedTx: string;
  publicKey: string;
  signature?: string;
}

export interface SignedMsg {
  message: string;
  publicKey: string;
  signature?: string;
}

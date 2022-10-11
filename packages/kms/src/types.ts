export interface BIP44 {
  type: number;
  account: number;
  index: number;
  password?: string;
  prefix?: string;
}

export interface KeyStore {
  t: number;
  m: number;
  s: string;
  j: string[];
}

export interface Account {
  address: string;
  publicKey: string;
}

export interface SignedTx {
  hash?: string;
  signature?: string;
  serializedTx?: string;
}

export interface Message {
  type: string;
  data: string;
}

export interface SignedMsg {
  msg: Message;
  signedMsg?: any;
}

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
} as const;

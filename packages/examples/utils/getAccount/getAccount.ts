/* eslint-disable no-console */
import { CHAIN } from '@dsrv/kms/lib/types';
import { Cosmos } from '@dsrv/kms/lib/blockchains/cosmos';
import { Ethereum } from '@dsrv/kms/lib/blockchains/ethereum';
import { Eth2 } from '@dsrv/kms/lib/blockchains/eth2';
import { Near } from '@dsrv/kms/lib/blockchains/near';
import { Solana } from '@dsrv/kms/lib/blockchains/solana';
import { Sui } from '@dsrv/kms/lib/blockchains/sui';
import { Aptos } from '@dsrv/kms/lib/blockchains/aptos';

/* Aptos getAccount */
export const getAptosAccount = (mnemonic: string) => {
  const aptosAccount = Aptos.getAccount({
    mnemonic,
    path: { type: CHAIN.APTOS, account: 0, index: 0 },
  });
  return aptosAccount;
};

/* Cosmos getAccount */
export const getCosmosAccount = (mnemonic: string) => {
  const cosmosAccount = Cosmos.getAccount({
    mnemonic,
    path: { type: CHAIN.COSMOS, account: 0, index: 0 },
  });
  return cosmosAccount;
};

/* Ethereum getAccount */
export const getEthereumAccount = (mnemonic: string) => {
  const ethereumAccount = Ethereum.getAccount({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  return ethereumAccount;
};

/* Celo getAccount */
export const getCeloAccount = (mnemonic: string) => {
  const celoAccount = Ethereum.getAccount({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  return celoAccount;
};

/* Eth2 getAccount (withdrawal)  */
export const getEth2AccountWithdrawal = (mnemonic: string) => {
  const eth2AccountWithdrawal = Eth2.getAccount({
    mnemonic,
    path: {
      type: CHAIN.ETHEREUM,
      account: 0,
      index: 0,
      keyType: 'withdrawal',
    },
  });
  return eth2AccountWithdrawal;
};

/* Eth2 getAccount (signing)  */
export const getEth2AccountSign = (mnemonic: string) => {
  const eth2AccountSign = Eth2.getAccount({
    mnemonic,
    path: {
      type: CHAIN.ETHEREUM,
      account: 0,
      index: 0,
    },
  });
  return eth2AccountSign;
};

/* Near getAccount */
export const getNearAccount = (mnemonic: string) => {
  const nearAccount = Near.getAccount({
    mnemonic,
    path: { type: CHAIN.NEAR, account: 0, index: 1 },
  });
  return nearAccount;
};

/* Solana getAccount */
export const getSolanaAccount = (mnemonic: string) => {
  const solanaAccount = Solana.getAccount({
    mnemonic,
    path: { type: CHAIN.SOLANA, account: 0, index: 0 },
  });
  return solanaAccount;
};

/* Sui getAccount */
export const getSuiAccount = (mnemonic: string) => {
  const suiAccount = Sui.getAccount({
    mnemonic,
    path: { type: CHAIN.SUI, account: 0, index: 0 },
  });
  return suiAccount;
};

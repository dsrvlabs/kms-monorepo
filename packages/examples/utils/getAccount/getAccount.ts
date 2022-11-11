/* eslint-disable no-console */
import { Account, CHAIN, Cosmos, Ethereum, Eth2, Near, Solana, Sui, Aptos } from '@dsrv/kms';

/* Aptos getAccount */
export const getAptosAccount = (mnemonic: string): Account => {
  const aptosAccount = Aptos.getAccount({
    mnemonic,
    path: { type: CHAIN.APTOS, account: 0, index: 0 },
  });
  return aptosAccount;
};

/* Cosmos getAccount */
export const getCosmosAccount = (mnemonic: string): Account => {
  const cosmosAccount = Cosmos.getAccount({
    mnemonic,
    path: { type: CHAIN.COSMOS, account: 0, index: 0 },
  });
  return cosmosAccount;
};

/* Ethereum getAccount */
export const getEthereumAccount = (mnemonic: string): Account => {
  const ethereumAccount = Ethereum.getAccount({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  return ethereumAccount;
};

/* Celo getAccount */
export const getCeloAccount = (mnemonic: string): Account => {
  const celoAccount = Ethereum.getAccount({
    mnemonic,
    path: { type: CHAIN.CELO, account: 0, index: 0 },
  });
  return celoAccount;
};

/* Eth2 getAccount (withdrawal)  */
export const getEth2AccountWithdrawal = (mnemonic: string): Account => {
  const eth2AccountWithdrawal = Eth2.getAccount(
    {
      mnemonic,
      path: {
        type: CHAIN.ETHEREUM,
        account: 0,
        index: 0,
      },
    },
    {
      keyType: 'withdrawal',
    },
  );
  return eth2AccountWithdrawal;
};

/* Eth2 getAccount (signing)  */
export const getEth2AccountSign = (mnemonic: string): Account => {
  const eth2AccountSign = Eth2.getAccount(
    {
      mnemonic,
      path: {
        type: CHAIN.ETHEREUM,
        account: 0,
        index: 0,
      },
    },
    {
      keyType: 'signing',
    },
  );
  return eth2AccountSign;
};

/* Near getAccount */
export const getNearAccount = (mnemonic: string): Account => {
  const nearAccount = Near.getAccount({
    mnemonic,
    path: { type: CHAIN.NEAR, account: 0, index: 1 },
  });
  return nearAccount;
};

/* Solana getAccount */
export const getSolanaAccount = (mnemonic: string): Account => {
  const solanaAccount = Solana.getAccount({
    mnemonic,
    path: { type: CHAIN.SOLANA, account: 0, index: 0 },
  });
  return solanaAccount;
};

/* Sui getAccount */
export const getSuiAccount = (mnemonic: string): Account => {
  const suiAccount = Sui.getAccount({
    mnemonic,
    path: { type: CHAIN.SUI, account: 0, index: 0 },
  });
  return suiAccount;
};

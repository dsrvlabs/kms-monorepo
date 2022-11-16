/* eslint-disable no-console */
import { CHAIN, Aptos, Cosmos, Ethereum, Eth2, Near, Solana, Sui } from '@dsrv/kms';

/* Aptos getPrivateKey */
export const getAptosPrivateKey = (mnemonic: string): string => {
  const aptosPrivateKey = Aptos.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.APTOS, account: 0, index: 0 },
  });
  return aptosPrivateKey;
};

/* Cosmos getPrivateKey */
export const getCosmosPrivateKey = (mnemonic: string): string => {
  const cosmosPrivateKey = Cosmos.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.COSMOS, account: 0, index: 0 },
  });
  return cosmosPrivateKey;
};

/* Ethereum getPrivateKey */
export const getEthereumPrivateKey = (mnemonic: string): string => {
  const ethereumPrivateKey = Ethereum.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  return ethereumPrivateKey;
};

/* Celo getPrivateKey */
export const getCeloPrivateKey = (mnemonic: string): string => {
  const celoPrivateKey = Ethereum.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  return celoPrivateKey;
};

/* Eth2 getPrivateKey (withdrawal)  */
export const getEth2PrivateKeyWithdrawal = (mnemonic: string): string => {
  const eth2PrivateKeyWithdrawal = Eth2.getPrivateKey(
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
  return eth2PrivateKeyWithdrawal;
};

/* Eth2 getPrivateKey (signing)  */
export const getEth2PrivateKeySign = (mnemonic: string): string => {
  const eth2PrivateKeySign = Eth2.getPrivateKey(
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
  return eth2PrivateKeySign;
};

/* Near getPrivateKey */
export const getNearPrivateKey = (mnemonic: string): string => {
  const nearPrivateKey = Near.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.NEAR, account: 0, index: 1 },
  });
  return nearPrivateKey;
};

/* Solana getPrivateKey */
export const getSolanaPrivateKey = (mnemonic: string): string => {
  const solanaPrivateKey = Solana.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.SOLANA, account: 0, index: 0 },
  });
  return solanaPrivateKey;
};

/* Sui getPrivateKey */
export const getSuiPrivateKey = (mnemonic: string): string => {
  const suiPrivateKey = Sui.getPrivateKey({
    mnemonic,
    path: { type: CHAIN.SUI, account: 0, index: 0 },
  });
  return suiPrivateKey;
};

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { CHAIN } from '@dsrv/kms/lib/types';
import { Cosmos } from '@dsrv/kms/lib/blockchains/cosmos';
import { Ethereum } from '@dsrv/kms/lib/blockchains/ethereum';
import { Near } from '@dsrv/kms/lib/blockchains/near';
import { Solana } from '@dsrv/kms/lib/blockchains/solana';
import { Sui } from '@dsrv/kms/lib/blockchains/sui';
import { Aptos } from '@dsrv/kms/lib/blockchains/aptos';
import { getAptosSerializedTx } from '../getTx/getAptosSerializedTx';
import { getCeloSerializedTx } from '../getTx/getCeloSerializedTx';
import { getCosmosSerializedTx } from '../getTx/getCosmosSerializedTx';
import { getEthereumTx } from '../getTx/getEthereumTx';
import { getNearSerializedTx } from '../getTx/getNearSerializedTx';
import { getSolanaSerializedTx } from '../getTx/getSolanaSerializedTx';
import { createEthereumSignedTx } from '../createSignedTx';

/* Aptos signTx */
export const getAptosSignedTx = async (mnemonic: string) => {
  const aptosAccount = Aptos.getAccount({
    mnemonic,
    path: { type: CHAIN.APTOS, account: 0, index: 0 },
  });
  const serializedTx = await getAptosSerializedTx(aptosAccount);
  const aptosSignedTx = Aptos.signTx(
    {
      mnemonic,
      path: { type: CHAIN.APTOS, account: 0, index: 0 },
    },
    serializedTx,
  );

  return aptosSignedTx;
};

/* Cosmos signTx */
export const getCosmosSignedTx = async (mnemonic: string) => {
  const cosmosAccount = Cosmos.getAccount({
    mnemonic,
    path: { type: CHAIN.COSMOS, account: 0, index: 0 },
  });
  const serializedTx = await getCosmosSerializedTx(cosmosAccount);
  const cosmosSignedTx = Cosmos.signTx(
    {
      mnemonic,
      path: { type: CHAIN.COSMOS, account: 0, index: 0 },
    },
    serializedTx,
  );

  console.log('[cosmos] cosmosSignedTx', cosmosSignedTx);
  return cosmosSignedTx;
};

/* Ethereum signTx */
export const getEthereumSignedTx = (mnemonic: string) => {
  const { serializedTx, unSignedTx } = getEthereumTx();

  const ethereumSignature = Ethereum.signTx(
    {
      mnemonic,
      path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
    },
    serializedTx,
  );

  const ethereumSignedTx = createEthereumSignedTx({
    unSignedTx,
    signatrue: ethereumSignature.signature,
  });

  return ethereumSignedTx;
};

/* Celo signTx */
export const getCeloSignedTx = (mnemonic: string) => {
  const celoAccount = Ethereum.getAccount({
    mnemonic,
    path: { type: CHAIN.CELO, account: 0, index: 0 },
  });
  const serializedTx = getCeloSerializedTx(celoAccount);
  const celoSignedTx = Ethereum.signTx(
    {
      mnemonic,
      path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
    },
    serializedTx,
  );

  return celoSignedTx;
};

export const getNearSignedTx = async (mnemonic: string) => {
  const nearAccount = Near.getAccount({
    mnemonic,
    path: { type: CHAIN.NEAR, account: 0, index: 1 },
  });
  const serializedTx = await getNearSerializedTx(nearAccount);
  const nearSignedTx = Near.signTx(
    {
      mnemonic,
      path: { type: CHAIN.NEAR, account: 0, index: 0 },
    },
    serializedTx,
  );

  return nearSignedTx;
};

export const getSolanaSignedTx = async (mnemonic: string) => {
  const solanaAccount = Solana.getAccount({
    mnemonic,
    path: { type: CHAIN.SOLANA, account: 0, index: 0 },
  });
  const serializedTx = await getSolanaSerializedTx(solanaAccount);
  const solanaSignedTx = Solana.signTx(
    {
      mnemonic,
      path: { type: CHAIN.SOLANA, account: 0, index: 0 },
    },
    serializedTx,
  );

  return solanaSignedTx;
};

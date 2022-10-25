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
import { getCeloTx } from '../getTx/getCeloTx';
import { getCosmosTx } from '../getTx/getCosmosTx';
import { getEthereumTx } from '../getTx/getEthereumTx';
import { getNearTx } from '../getTx/getNearTx';
import { getSolanaSerializedTx } from '../getTx/getSolanaSerializedTx';
import { createEthereumSignedTx } from '../createSignedTx';
import { createCeloSignedTx } from '../createSignedTx/createCeloSignedTx';
import { createNearSignedTx } from '../createSignedTx/createNearSignedTx';
import { createCosmosSignedTx } from '../createSignedTx/createCosmosSignedTx';

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
  const { serializedTx, unSignedTx } = await getCosmosTx(cosmosAccount);
  const cosmosSignature = Cosmos.signTx(
    {
      mnemonic,
      path: { type: CHAIN.COSMOS, account: 0, index: 0 },
    },
    serializedTx,
  );

  const cosmosSignedTx = createCosmosSignedTx({
    unSignedTx,
    signature: cosmosSignature.signature,
  });

  console.log('[cosmos] cosmosSignedTx', cosmosSignedTx);
  return cosmosSignedTx;
};

/* Ethereum signTx */
export const getEthereumSignedTx = async (mnemonic: string) => {
  const ethereumAccount = Ethereum.getAccount({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  const { serializedTx, unSignedTx } = await getEthereumTx(ethereumAccount);

  const ethereumSignature = Ethereum.signTx(
    {
      mnemonic,
      path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
    },
    serializedTx,
  );

  const ethereumSignedTx = createEthereumSignedTx({
    unSignedTx,
    signature: ethereumSignature.signature,
  });

  console.log('ethereumSignature: ', ethereumSignature);

  return ethereumSignedTx;
};

/* Celo signTx */
export const getCeloSignedTx = async (mnemonic: string) => {
  const celoAccount = Ethereum.getAccount({
    mnemonic,
    path: { type: CHAIN.CELO, account: 0, index: 0 },
  });
  const { serializedTx, unSignedTx } = await getCeloTx(celoAccount);
  const celoSignature = Ethereum.signTx(
    {
      mnemonic,
      path: { type: CHAIN.CELO, account: 0, index: 0 },
    },
    serializedTx,
  );
  const celoSignedTx = createCeloSignedTx({
    unSignedTx,
    signature: celoSignature.signature,
  });

  console.log('celoSignature: ', celoSignature);

  return celoSignedTx;
};

/* Near signTx */
export const getNearSignedTx = async (mnemonic: string) => {
  const nearAccount = Near.getAccount({
    mnemonic,
    path: { type: CHAIN.NEAR, account: 0, index: 1 },
  });
  const { serializedTx, unSignedTx } = await getNearTx(nearAccount);
  const nearSignature = Near.signTx(
    {
      mnemonic,
      path: { type: CHAIN.NEAR, account: 0, index: 1 },
    },
    serializedTx,
  );

  const nearSignedTx = createNearSignedTx({ unSignedTx, signature: nearSignature.signature });
  console.log('near signedeTx', nearSignedTx);
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

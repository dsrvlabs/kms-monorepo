/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { CHAIN } from '@dsrv/kms/lib/types';
import { Cosmos } from '@dsrv/kms/lib/blockchains/cosmos';
import { Ethereum } from '@dsrv/kms/lib/blockchains/ethereum';
import { Near } from '@dsrv/kms/lib/blockchains/near';
import { Solana } from '@dsrv/kms/lib/blockchains/solana';
import { Sui } from '@dsrv/kms/lib/blockchains/sui';
import { Aptos } from '@dsrv/kms/lib/blockchains/aptos';
import { Transaction } from '@solana/web3.js';
import { getAptosTx } from '../getTx/getAptosTx';
import { getCeloTx } from '../getTx/getCeloTx';
import { getCosmosTx } from '../getTx/getCosmosTx';
import { getEthereumTx } from '../getTx/getEthereumTx';
import { getNearTx } from '../getTx/getNearTx';
import { getSolanaTx } from '../getTx/getSolanaTx';
import { createEthereumSignedTx } from '../createSignedTx';
import { createCeloSignedTx } from '../createSignedTx/createCeloSignedTx';
import { createNearSignedTx } from '../createSignedTx/createNearSignedTx';
import { createCosmosSignedTx } from '../createSignedTx/createCosmosSignedTx';
import { createSolanaSignedTx } from '../createSignedTx/createSolanaSignedtx';
import { createAptosSignedTx } from '../createSignedTx/createAptosSignedTx';

/* Aptos signTx */
export const getAptosSignedTx = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getAptosTx(mnemonic);
  const aptosSignature = Aptos.signTx(
    {
      mnemonic,
      path: { type: CHAIN.APTOS, account: 0, index: 0 },
    },
    serializedTx,
  );
  const aptosSignedTx = await createAptosSignedTx({
    serializedTx,
    signature: aptosSignature.signature,
    mnemonic,
  });

  return { aptosSignedTx, signature: aptosSignature.signature };
};

/* Cosmos signTx */
export const getCosmosSignedTx = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getCosmosTx(mnemonic);

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

  return { cosmosSignedTx, signature: cosmosSignature.signature };
};

/* Ethereum signTx */
export const getEthereumSignedTx = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getEthereumTx(mnemonic);

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

  return { ethereumSignedTx, signature: ethereumSignature.signature };
};

/* Celo signTx */
export const getCeloSignedTx = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getCeloTx(mnemonic);
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

  return { celoSignedTx, signature: celoSignature.signature };
};

/* Near signTx */
export const getNearSignedTx = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getNearTx(mnemonic);
  const nearSignature = Near.signTx(
    {
      mnemonic,
      path: { type: CHAIN.NEAR, account: 0, index: 1 },
    },
    serializedTx,
  );

  const nearSignedTx = createNearSignedTx({ unSignedTx, signature: nearSignature.signature });

  return { nearSignedTx, signature: nearSignature.signature };
};

export const getSolanaSignedTx = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getSolanaTx(mnemonic);
  const solanaSignature = Solana.signTx(
    {
      mnemonic,
      path: { type: CHAIN.SOLANA, account: 0, index: 0 },
    },
    serializedTx,
  );

  const solanaSignedTx = await createSolanaSignedTx({
    unSignedTx,
    signature: solanaSignature.signature,
  });

  return { solanaSignedTx, signature: solanaSignature.signature };
};

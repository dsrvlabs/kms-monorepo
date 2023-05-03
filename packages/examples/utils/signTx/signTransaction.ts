/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { CHAIN, Cosmos, Ethereum, Near, Solana, Aptos, Ton, Sui } from '@dsrv/kms';
import { getAptosTx } from '../getTx/getAptosTx';
import { getCeloTx } from '../getTx/getCeloTx';
import { getCosmosTx } from '../getTx/getCosmosTx';
import { getEthereumTx } from '../getTx/getEthereumTx';
import { getNearTx } from '../getTx/getNearTx';
import { getSolanaTx } from '../getTx/getSolanaTx';
import { createEthereumSignedTx, createSuiSignedTx, createTonSignedTx } from '../createSignedTx';
import { createCeloSignedTx } from '../createSignedTx/createCeloSignedTx';
import { createNearSignedTx } from '../createSignedTx/createNearSignedTx';
import { createCosmosSignedTx } from '../createSignedTx/createCosmosSignedTx';
import { createSolanaSignedTx } from '../createSignedTx/createSolanaSignedtx';
import { createAptosSignedTx } from '../createSignedTx/createAptosSignedTx';
import { getSuiTx, getTonTx } from '../getTx';

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
  const aptosSignedTx = createAptosSignedTx({
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

/* Solana signTx */
export const getSolanaSignedTx = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getSolanaTx(mnemonic);
  const solanaSignature = Solana.signTx(
    {
      mnemonic,
      path: { type: CHAIN.SOLANA, account: 0, index: 0 },
    },
    serializedTx,
  );

  const solanaSignedTx = createSolanaSignedTx({
    unSignedTx,
    signature: solanaSignature.signature,
  });

  return { solanaSignedTx, signature: solanaSignature.signature };
};

/* Ton signTx */
export const getTonSignedTx = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getTonTx(mnemonic);
  const tonSignature = Ton.signTx(
    {
      mnemonic,
      path: { type: CHAIN.TON, account: 0, index: 0 },
    },
    serializedTx,
  );

  const tonSignedTx = createTonSignedTx({
    unSignedTx,
    signature: tonSignature.signature,
  });

  return { tonSignedTx, signature: tonSignature.signature };
};

/* Sui signTx */
export const getSuiSignedTx = async (mnemonic: string) => {
  const { serializedTx, unSignedTx } = await getSuiTx(mnemonic);
  const suiSignature = Sui.signTx(
    {
      mnemonic,
      path: { type: CHAIN.SUI, account: 0, index: 0 },
    },
    serializedTx,
  );

  const suiSignedTx = createSuiSignedTx({
    unSignedTx,
    signature: suiSignature.signature,
  });

  return { suiSignedTx, signature: suiSignature.signature };
};

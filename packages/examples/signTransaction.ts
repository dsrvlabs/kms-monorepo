/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { CHAIN } from '@dsrv/kms/lib/types';
import { Cosmos } from '@dsrv/kms/lib/blockchains/cosmos';
import { Ethereum } from '@dsrv/kms/lib/blockchains/ethereum';
import { Near } from '@dsrv/kms/lib/blockchains/near';
import { Solana } from '@dsrv/kms/lib/blockchains/solana';
import { Sui } from '@dsrv/kms/lib/blockchains/sui';
import { Aptos } from '@dsrv/kms/lib/blockchains/aptos';
import { getAptosSerializedTx } from './utils/getAptosSerializedTx';
import { getCosmosSerializedTx } from './utils/getCosmosSerializedTx';
import { getEthereumSerializedTx } from './utils/getEthereumSerializedTx';
import { getCeloSerializedTx } from './utils/getCeleSerializedTx';
import { getNearSerializedTx } from './utils/getNearSerializedTx';
import { getSolanaSerializedTx } from './utils/getSolanaSerializedTx';

const MNEMONIC = require('./mnemonic.json');

const mnemonic = MNEMONIC.bip44;

/* Aptos signTx */
const getAptosSignedTx = async () => {
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
const getCosmosSignedTx = async () => {
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
const getEthereumSignedTx = () => {
  const ethereumAccount = Ethereum.getAccount({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  const serializedTx = getEthereumSerializedTx(ethereumAccount);
  const ethereumSignedTx = Ethereum.signTx(
    {
      mnemonic,
      path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
    },
    serializedTx,
  );

  return ethereumSignedTx;
};

/* Celo signTx */
const getCeloSignedTx = () => {
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

const getNearSignedTx = async () => {
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

const getSolanaSignedTx = async () => {
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

const main = async () => {
  const aptosSignedTx = await getAptosSignedTx();
  const cosmosSignedTx = await getCosmosSignedTx();
  const ethereumSignedTx = getEthereumSignedTx();
  const celoSignedTx = getCeloSignedTx();
  const nearSignedTx = await getNearSignedTx();
  const solanaSignedTx = await getSolanaSignedTx();

  console.log('Aptos SignedTx : ', aptosSignedTx);
  console.log('Cosmos SignedTx : ', cosmosSignedTx);
  console.log('Ethereum SignedTx : ', ethereumSignedTx);
  console.log('Celo SignedTx : ', celoSignedTx);
  console.log('Near SignedTx : ', nearSignedTx);
  console.log('Solana SignedTx : ', solanaSignedTx);
};

main();

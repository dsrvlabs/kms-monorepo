/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { CHAIN } from '@dsrv/kms/lib/types';
import { Cosmos } from '@dsrv/kms/lib/blockchains/cosmos';
import { Ethereum } from '@dsrv/kms/lib/blockchains/ethereum';
import { Near } from '@dsrv/kms/lib/blockchains/near';
import { Solana } from '@dsrv/kms/lib/blockchains/solana';
import { Sui } from '@dsrv/kms/lib/blockchains/sui';
import { Aptos } from '@dsrv/kms/lib/blockchains/aptos';
import { getAptosSerializedTx } from './signTransaction/getAptosSerializedTx';
import { getCosmosSerializedTx } from './signTransaction/getCosmosSerializedTx';
import { getEthereumSerializedTx } from './signTransaction/getEthereumSerializedTx';
import { getCeloSerializedTx } from './signTransaction/getCeleSerializedTx';

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

const main = async () => {
  const aptosSignedTx = await getAptosSignedTx();
  const cosmosSignedTx = await getCosmosSignedTx();
  const ethereumSignedTx = getEthereumSignedTx();
  const celoSignedTx = getCeloSignedTx();

  console.log('Aptos SignedTx : ', aptosSignedTx);
  console.log('Cosmos SignedTx : ', cosmosSignedTx);
  console.log('Ethereum SignedTx : ', ethereumSignedTx);
  console.log('Celo SignedTx : ', celoSignedTx);
};

main();

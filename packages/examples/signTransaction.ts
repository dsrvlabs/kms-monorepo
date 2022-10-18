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

  return cosmosSignedTx;
};

const main = async () => {
  const aptosSignedTx = await getAptosSignedTx();
  const cosmosSignedTx = await getCosmosSignedTx();

  console.log('Aptos SignedTx : ', aptosSignedTx);
  console.log('Cosmos SignedTx : ', cosmosSignedTx);
};

main();

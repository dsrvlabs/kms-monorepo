/* eslint-disable no-console */
import { CHAIN } from '@dsrv/kms/lib/types';
import { Cosmos } from '@dsrv/kms/lib/blockchains/cosmos';
import { Ethereum } from '@dsrv/kms/lib/blockchains/ethereum';
import { Eth2 } from '@dsrv/kms/lib/blockchains/eth2';
import { Near } from '@dsrv/kms/lib/blockchains/near';
import { Solana } from '@dsrv/kms/lib/blockchains/solana';
import { Sui } from '@dsrv/kms/lib/blockchains/sui';

const { Aptos } = require('@dsrv/kms');

const MNEMONIC = require('./mnemonic.json');

const mnemonic = MNEMONIC.bip44;

/* Aptos getAccount */
const getAptosAccount = () => {
  const aptosAccount = Aptos.getAccount({
    mnemonic,
    path: { type: CHAIN.APTOS, account: 0, index: 0 },
  });
  return aptosAccount;
};

/* Cosmos getAccount */
const getCosmosAccount = () => {
  const cosmosAccount = Cosmos.getAccount({
    mnemonic,
    path: { type: CHAIN.COSMOS, account: 0, index: 0 },
  });
  return cosmosAccount;
};

/* Ethereum getAccount */
const getEthereumAccount = () => {
  const ethereumAccount = Ethereum.getAccount({
    mnemonic,
    path: { type: CHAIN.ETHEREUM, account: 0, index: 0 },
  });
  return ethereumAccount;
};

/* Eth2 getAccount (withdrawal)  */
const getEth2AccountWithdrawal = () => {
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
const getEth2AccountSign = () => {
  const eth2AccountSign = Eth2.getAccount({
    mnemonic,
    path: {
      type: CHAIN.ETHEREUM,
      account: 0,
      index: 0,
      keyType: 'signing',
    },
  });
  return eth2AccountSign;
};

/* Near getAccount */
const getNearAccount = () => {
  const nearAccount = Near.getAccount({
    mnemonic,
    path: { type: CHAIN.NEAR, account: 0, index: 1 },
  });
  return nearAccount;
};

/* Solana getAccount */
const getSolanaAccount = () => {
  const solanaAccount = Solana.getAccount({
    mnemonic,
    path: { type: CHAIN.SOLANA, account: 0, index: 0 },
  });
  return solanaAccount;
};

/* Sui getAccount */
const getSuiAccount = () => {
  const suiAccount = Sui.getAccount({
    mnemonic,
    path: { type: CHAIN.SUI, account: 0, index: 0 },
  });
  return suiAccount;
};

const main = () => {
  const aptosAccount = getAptosAccount();
  const cosmosAccount = getCosmosAccount();
  const ethereumAccount = getEthereumAccount();
  const eth2AccountWithdrawal = getEth2AccountWithdrawal();
  const eth2AccountSign = getEth2AccountSign();
  const nearAccount = getNearAccount();
  const solanaAccount = getSolanaAccount();
  const suiAccount = getSuiAccount();

  console.log('aptosAccount', aptosAccount);
  console.log('cosmosAccount', cosmosAccount);
  console.log('ethereumAccount', ethereumAccount);
  console.log('eth2AccountWithdrawal', eth2AccountWithdrawal);
  console.log('eth2AccountSign', eth2AccountSign);
  console.log('nearAccount', nearAccount);
  console.log('solanaAccount', solanaAccount);
  console.log('suiAccount', suiAccount);
};

main();

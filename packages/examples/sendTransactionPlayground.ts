/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { ethers } from 'ethers';
import { sendEthereumTransaction } from './utils';
import { stringToHex } from './utils/common';
import {
  getAptosSignedTx,
  getCosmosSignedTx,
  getEthereumSignedTx,
  getCeloSignedTx,
  getNearSignedTx,
  getSolanaSignedTx,
} from './utils/signTx';

const MNEMONIC = require('./mnemonic.json');

const main = async () => {
  const mnemonic = MNEMONIC.bip44;
  /* ethereum sendtransaction */
  const ethereumSignedTx = getEthereumSignedTx(mnemonic);
  const ethereumTxHash = await sendEthereumTransaction(ethereumSignedTx);
  console.log('Ethereum TxHash : ', ethereumTxHash);
};
main();
